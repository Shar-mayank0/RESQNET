import os
import datetime
from typing import Dict, List, Any
from pydantic import BaseModel
from dotenv import load_dotenv
import logging
import praw
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from .models import NewsArticle, DisasterEvent, AIReport, WeatherData, DisasterData
from .gcp import geminiAgent  # Adjusted import path assuming geminiAgent.py is in the same directory

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
REDDIT_CLIENT_ID = os.getenv("REDDIT_CLIENT_ID")
REDDIT_CLIENT_SECRET = os.getenv("REDDIT_CLIENT_SECRET")
REDDIT_USER_AGENT = os.getenv("REDDIT_USER_AGENT")

if not all([REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, REDDIT_USER_AGENT]):
    raise ValueError("Reddit API credentials not set in environment variables")

# Define data models for the agent's output
# class DisasterResponseOutput(BaseModel):
#     disaster_type: str
#     affected_districts: List[str]
#     affected_population: int
#     evacuation_centers: List[Dict[str, Any]]
#     disaster_specific_data: Dict[str, Any]
#     most_affected_areas: List[str]
#     relief_operations: List[Dict[str, Any]]
#     active_incidents: List[Dict[str, Any]]
#     social_media_insights: List[Dict[str, Any]]
#     detailed_report: str
#     action_plan: List[Dict[str, Any]]

class DisasterResponseAgent:
    def __init__(self):
        # Initialize Gemini Agent
        # Fix: geminiAgent is a module, not a callable class
        # We need to access the actual class or function from the module
        self.gemini_agent = geminiAgent.GeminiAgent()
        # Set up Reddit API
        self.reddit = praw.Reddit(
            client_id=REDDIT_CLIENT_ID,
            client_secret=REDDIT_CLIENT_SECRET,
            user_agent=REDDIT_USER_AGENT,
        )
        logger.info("Disaster Response Agent initialized with Reddit API")

    def _fetch_reddit_posts(self, disaster_type: str, location: str) -> List[Dict[str, Any]]:
        """
        Fetch Reddit posts related to the disaster type and location with enhanced filtering
        """
        try:
            # Define subreddits to search based on disaster type
            subreddit_mapping = {
                "flood": ["news", "worldnews", "disaster", "weather", "floods"],
                "earthquake": ["news", "worldnews", "disaster", "earthquakes"],
                "cyclone": ["news", "worldnews", "disaster", "weather", "hurricanes"],
                "wildfire": ["news", "worldnews", "disaster", "wildfires"],
                "landslide": ["news", "worldnews", "disaster", "geology"]
            }
            subreddits = subreddit_mapping.get(disaster_type, ["news", "worldnews", "disaster"])
            subreddit_str = "+".join(subreddits)
            subreddit = self.reddit.subreddit(subreddit_str)

            # Construct search query with disaster-specific keywords
            disaster_keywords = {
                "flood": ["flood", "flooding", "heavy rain", "inundation"],
                "earthquake": ["earthquake", "tremor", "seismic", "aftershock"],
                "cyclone": ["cyclone", "hurricane", "typhoon", "storm surge"],
                "wildfire": ["wildfire", "forest fire", "bushfire", "fire containment"],
                "landslide": ["landslide", "mudslide", "debris flow", "rockfall"]
            }
            keywords = disaster_keywords.get(disaster_type, [disaster_type])
            query = f"({' OR '.join(keywords)}) {location} -inurl:(signup OR login)"
            logger.info(f"Fetching Reddit posts for query: {query} in subreddits: {subreddit_str}")

            # Search for posts
            posts = []
            for submission in subreddit.search(query, limit=20, sort="new", time_filter="week"):
                # Filter out low-quality posts (e.g., too short, irrelevant)
                if len(submission.title) < 10 or (submission.is_self and len(submission.selftext) < 20):
                    continue

                # Calculate relevance score (simple heuristic based on keyword matches)
                title_lower = submission.title.lower()
                text_lower = submission.selftext.lower() if submission.is_self else submission.url.lower()
                relevance_score = sum(1 for keyword in keywords if keyword in title_lower or keyword in text_lower)
                if location.lower() in title_lower or location.lower() in text_lower:
                    relevance_score += 2

                if relevance_score < 2:  # Require at least some relevance
                    continue

                posts.append({
                    "title": submission.title,
                    "text": submission.selftext if submission.is_self else submission.url,
                    "author": str(submission.author),
                    "created_at": datetime.datetime.fromtimestamp(submission.created_utc).isoformat(),
                    "url": f"https://reddit.com{submission.permalink}",
                    "score": submission.score,
                    "relevance_score": relevance_score
                })

            # Sort posts by relevance score and limit to top 10
            posts = sorted(posts, key=lambda x: x["relevance_score"], reverse=True)[:10]
            logger.info(f"Fetched {len(posts)} relevant Reddit posts")
            return posts

        except Exception as e:
            logger.error(f"Error fetching Reddit posts: {str(e)}")
            return []

    def process_disaster_data(self, disaster_data: dict) -> DisasterResponseOutput:
        """
        Process disaster data and return structured response with relevant information
        """
        try:
            logger.info("Processing disaster data...")

            # Extract relevant information using Gemini Agent
            extracted_data = self.gemini_agent.extract_relevant_info(disaster_data)

            # Generate detailed report using Gemini Agent
            detailed_report = self.gemini_agent.generate_detailed_report(extracted_data)

            # Generate structured action plan using Gemini Agent
            disaster_type = extracted_data.get("disaster_type", "unknown")
            action_plan = self.gemini_agent.generate_action_plan(detailed_report, disaster_type)

            # Fetch Reddit posts
            location = extracted_data.get("affected_districts", ["unknown"])[0]
            social_media_insights = self._fetch_reddit_posts(disaster_type, location)

            # Combine everything into the output format
            output = DisasterResponseOutput(
                disaster_type=disaster_type,
                affected_districts=extracted_data.get("affected_districts", []),
                affected_population=extracted_data.get("affected_population", 0),
                evacuation_centers=extracted_data.get("evacuation_centers", []),
                disaster_specific_data=extracted_data.get("disaster_specific_data", {}),
                most_affected_areas=extracted_data.get("most_affected_areas", []),
                relief_operations=extracted_data.get("relief_operations", []),
                active_incidents=extracted_data.get("active_incidents", []),
                social_media_insights=social_media_insights,
                detailed_report=detailed_report,
                action_plan=action_plan
            )

            logger.info("Disaster data processing complete")
            return output

        except Exception as e:
            logger.error(f"Error processing disaster data: {str(e)}")
            raise

# API Views
class ProcessDisasterDataView(APIView):
    """
    API view to process disaster data and return a structured response
    """
    # Sample data for different disaster types
    sample_data = {
        "flood": {
            "news_articles": [
                {
                    "article_id": "news123",
                    "title": "Severe Flooding in Eastern Districts",
                    "link": "https://example.com/news/123",
                    "description": "Heavy rainfall has caused severe flooding in multiple districts",
                    "content": "The recent heavy rainfall has resulted in severe flooding across the eastern districts. Rivers have overflowed and several dams are at critical levels. Local authorities have begun evacuation operations.",
                    "pubDate": "2025-03-29T12:00:00Z",
                    "image_url": "https://example.com/images/flood.jpg",
                    "source_name": "Regional News Network",
                    "source_url": "https://rnn.com",
                    "language": "en",
                    "country": ["India"],
                    "category": ["disaster", "flood", "weather"],
                    "sentiment": "negative",
                    "sentiment_stats": {"negative": 0.85, "neutral": 0.10, "positive": 0.05},
                    "ai_tag": ["flooding", "evacuation", "eastern region"]
                }
            ],
            "disaster_events": [
                {
                    "event_id": "flood123",
                    "event_type": "flood",
                    "severity": 8.5,
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[[85.123, 25.456], [85.234, 25.567], [85.345, 25.456], [85.123, 25.456]]]
                    },
                    "affected_regions": ["East District", "North District", "Central Region"],
                    "timestamp": "2025-03-28T12:00:00Z",
                    "source": "Regional Disaster Management Authority"
                }
            ],
            "ai_reports": [
                {
                    "report_id": "ai123",
                    "location": "Eastern Region",
                    "latitude": 85.123,
                    "longitude": 25.456,
                    "summary": "Severe flooding affecting three districts with approximately 50,000 people impacted.",
                    "detailed_report": "The flooding began after 72 hours of continuous rainfall. Water levels in the main river have risen by 3.2 meters above the danger mark. Five villages are completely submerged, and fifteen others are partially affected. Infrastructure damage includes three bridges and approximately 25 km of roads.",
                    "severity_index": 8.2,
                    "top_affected_areas": {"East District": 0.85, "North District": 0.75, "Central Region": 0.65}
                }
            ],
            "weather_data": [
                {
                    "location_id": "loc123",
                    "location_name": "East District",
                    "latitude": 85.123,
                    "longitude": 25.456,
                    "temperature": 27.5,
                    "humidity": 95,
                    "wind_speed": 15.2,
                    "rainfall": 320.5,
                    "air_quality_index": 85,
                    "timestamp": "2025-03-29T18:00:00Z"
                }
            ]
        },
        # You can add other disaster types here following the same structure
    }

    def get(self, request):
        try:
            # Get the disaster type from the request parameters
            disaster_type = request.GET.get("disaster_type", "flood").lower()
            
            # Get the disaster data for the requested type
            disaster_data = self.sample_data.get(disaster_type)
            if not disaster_data:
                return Response(
                    {"error": f"Invalid disaster type: {disaster_type}. Supported types: {', '.join(self.sample_data.keys())}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Process the disaster data using the agent
            agent = DisasterResponseAgent()
            response = agent.process_disaster_data(disaster_data)

            # Check if response is a Pydantic model or a dict
            if hasattr(response, 'model_dump'):
                # For Pydantic v2+
                response_data = response.model_dump()
            elif hasattr(response, 'dict'):
                # For older Pydantic versions
                response_data = response.dict()
            else:
                # Already a dict
                response_data = response
                
            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error processing disaster data: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def test_disaster_data(request):
    """
    A simple view to test the disaster data processing
    """
    try:
        view = ProcessDisasterDataView()
        response = view.get(request)
        return JsonResponse(response.data, status=response.status_code)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)