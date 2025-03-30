import os
import json
from typing import List, Dict, Any
import google.generativeai as genai
import datetime
from dotenv import load_dotenv
import logging
from .models import ScrapedData, RedditPost, FormattedDisasterData
from .scraper import DisasterDataScraper
# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable not set")

# Configure Gemini API
genai.configure(api_key=API_KEY)

class DisasterDataAgent:
    def __init__(self):
        self.model = genai.GenerativeModel(
            model_name="gemini-1.5-pro",
            generation_config={
                "temperature": 0.2,
                "top_p": 0.95,
                "top_k": 40,
                "max_output_tokens": 8192,
            }
        )
        logger.info("Disaster Data Agent initialized with Gemini 1.5 Pro model")

    def combine_and_format_data(self, disaster_type: str, location: str) -> List[Dict[str, Any]]:
        """
        Combine scraped data and Reddit posts, format for BERT training, and save to database
        """
        try:
            # Fetch scraped data
            scraped_data = ScrapedData.objects.filter(disaster_type=disaster_type, location=location)
            reddit_posts = RedditPost.objects.filter(disaster_type=disaster_type, location=location)

            # Prepare data for Gemini
            scraped_data_list = [
                {
                    "title": data.title,
                    "description": data.description,
                    "content": data.content,
                    "weather_data": data.get_weather_data(),  # Use helper method
                    "pub_date": str(data.pub_date)
                } for data in scraped_data
            ]
            reddit_posts_list = [
                {
                    "title": post.title,
                    "text": post.text,
                    "created_at": str(post.created_at),
                    "score": post.score
                } for post in reddit_posts
            ]

            prompt = f"""
            You are a disaster data processing agent. Your task is to combine the following scraped disaster data and Reddit posts
            into a format suitable for training a BERT model to classify disaster severity and extract key information.

            The data should be formatted as a list of JSON objects, where each object represents a combined data point with:
            - "combined_text": A single string combining relevant text from scraped data and Reddit posts, suitable for BERT input
            - "metadata": A dictionary containing:
                - "severity": Estimated severity (0-10 scale)
                - "affected_population": Estimated affected population
                - "weather_conditions": Summary of weather data (e.g., "Heavy rainfall, 320mm")
                - "social_sentiment": Sentiment from Reddit posts (e.g., "negative", "neutral", "positive")

            Ensure the combined_text is concise (max 512 tokens) and relevant for disaster analysis.

            Scraped Data:
            {json.dumps(DisasterDataScraper.scrape_ndem_data(), indent=2)}

            Reddit Posts:
            {json.dumps(reddit_posts_list, indent=2)}

            Return ONLY the JSON list with no additional text.
            """

            response = self.model.generate_content(prompt)
            response_text = response.text
            json_start = response_text.find('[')
            json_end = response_text.rfind(']') + 1

            if json_start != -1 and json_end != -1:
                json_str = response_text[json_start:json_end]
                formatted_data = json.loads(json_str)
            else:
                raise ValueError("Could not extract JSON from model response")

            # Save to database
            for i, data in enumerate(formatted_data):
                formatted_entry = FormattedDisasterData(
                    data_id=f"formatted_{disaster_type}_{location}_{i}_{int(datetime.datetime.now().timestamp())}",
                    disaster_type=disaster_type,
                    location=location,
                    combined_text=data["combined_text"],
                )
                formatted_entry.set_metadata(data["metadata"])  # Use helper method
                formatted_entry.save()

            logger.info(f"Successfully formatted and saved {len(formatted_data)} data points for BERT training")
            return formatted_data

        except Exception as e:
            logger.error(f"Error combining and formatting data: {str(e)}")
            raise

# Test the agent
if __name__ == "__main__":
    agent = DisasterDataAgent()
    agent.combine_and_format_data("flood", "East District")
