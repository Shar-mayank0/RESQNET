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
from gcp.geminiAgent import GeminiAgent # Adjusted import path assuming geminiAgent.py is in the same directory

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
class DisasterResponseOutput(BaseModel):
    disaster_type: str
    affected_districts: List[str]
    affected_population: int
    evacuation_centers: List[Dict[str, Any]]
    disaster_specific_data: Dict[str, Any]
    most_affected_areas: List[str]
    relief_operations: List[Dict[str, Any]]
    active_incidents: List[Dict[str, Any]]
    social_media_insights: List[Dict[str, Any]]
    detailed_report: str
    action_plan: List[Dict[str, Any]]

class DisasterResponseAgent:
    def __init__(self):
        # Initialize Gemini Agent
        self.gemini_agent = GeminiAgent()
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

    def process_disaster_data(self, disaster_data: DisasterData) -> DisasterResponseOutput:
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
    def post(self, request):
        try:
            # In a real scenario, you would fetch this data from your database or external APIs
            # For now, we'll use sample data based on the disaster type provided in the request
            disaster_type = request.data.get("disaster_type", "flood").lower()

            # Sample data for different disaster types
            sample_data = {
                "flood": DisasterData(
                    news_articles=[
                        NewsArticle(
                            article_id="news123",
                            title="Severe Flooding in Eastern Districts",
                            link="https://example.com/news/123",
                            description="Heavy rainfall has caused severe flooding in multiple districts",
                            content="The recent heavy rainfall has resulted in severe flooding across the eastern districts. Rivers have overflowed and several dams are at critical levels. Local authorities have begun evacuation operations.",
                            pubDate=datetime.datetime.now() - datetime.timedelta(hours=12),
                            image_url="https://example.com/images/flood.jpg",
                            source_name="Regional News Network",
                            source_url="https://rnn.com",
                            language="en",
                            country=["India"],
                            category=["disaster", "flood", "weather"],
                            sentiment="negative",
                            sentiment_stats={"negative": 0.85, "neutral": 0.10, "positive": 0.05},
                            ai_tag=["flooding", "evacuation", "eastern region"]
                        )
                    ],
                    disaster_events=[
                        DisasterEvent(
                            event_id="flood123",
                            event_type="flood",
                            severity=8.5,
                            geometry={
                                "type": "Polygon",
                                "coordinates": [[[85.123, 25.456], [85.234, 25.567], [85.345, 25.456], [85.123, 25.456]]]
                            },
                            affected_regions=["East District", "North District", "Central Region"],
                            timestamp=datetime.datetime.now() - datetime.timedelta(hours=24),
                            source="Regional Disaster Management Authority"
                        )
                    ],
                    ai_reports=[
                        AIReport(
                            report_id="ai123",
                            location="Eastern Region",
                            latitude=85.123,
                            longitude=25.456,
                            summary="Severe flooding affecting three districts with approximately 50,000 people impacted.",
                            detailed_report="The flooding began after 72 hours of continuous rainfall. Water levels in the main river have risen by 3.2 meters above the danger mark. Five villages are completely submerged, and fifteen others are partially affected. Infrastructure damage includes three bridges and approximately 25 km of roads.",
                            severity_index=8.2,
                            top_affected_areas={"East District": 0.85, "North District": 0.75, "Central Region": 0.65}
                        )
                    ],
                    weather_data=[
                        WeatherData(
                            location_id="loc123",
                            location_name="East District",
                            latitude=85.123,
                            longitude=25.456,
                            temperature=27.5,
                            humidity=95,
                            wind_speed=15.2,
                            rainfall=320.5,
                            air_quality_index=85,
                            timestamp=datetime.datetime.now() - datetime.timedelta(hours=6)
                        )
                    ]
                ),
                "earthquake": DisasterData(
                    news_articles=[
                        NewsArticle(
                            article_id="news124",
                            title="Earthquake Strikes Himalayan Region",
                            link="https://example.com/news/124",
                            description="A 6.2 magnitude earthquake struck the Himalayan region, causing widespread damage.",
                            content="A 6.2 magnitude earthquake hit the Himalayan region at 3:00 AM today. Several buildings have collapsed, and aftershocks are expected. Rescue operations are underway.",
                            pubDate=datetime.datetime.now() - datetime.timedelta(hours=8),
                            image_url="https://example.com/images/earthquake.jpg",
                            source_name="National News Agency",
                            source_url="https://nna.com",
                            language="en",
                            country=["India"],
                            category=["disaster", "earthquake"],
                            sentiment="negative",
                            sentiment_stats={"negative": 0.90, "neutral": 0.08, "positive": 0.02},
                            ai_tag=["earthquake", "himalayan region", "rescue"]
                        )
                    ],
                    disaster_events=[
                        DisasterEvent(
                            event_id="eq124",
                            event_type="earthquake",
                            severity=7.8,
                            geometry={
                                "type": "Point",
                                "coordinates": [77.1734, 31.1048]
                            },
                            affected_regions=["Shimla", "Manali"],
                            timestamp=datetime.datetime.now() - datetime.timedelta(hours=8),
                            source="Geological Survey of India"
                        )
                    ],
                    ai_reports=[
                        AIReport(
                            report_id="ai124",
                            location="Shimla",
                            latitude=77.1734,
                            longitude=31.1048,
                            summary="6.2 magnitude earthquake in Shimla, affecting 20,000 people.",
                            detailed_report="The earthquake caused significant structural damage in Shimla and Manali. Aftershocks are likely within the next 48 hours. Several roads are blocked due to debris.",
                            severity_index=7.5,
                            top_affected_areas={"Shimla": 0.90, "Manali": 0.70}
                        )
                    ],
                    weather_data=[
                        WeatherData(
                            location_id="loc124",
                            location_name="Shimla",
                            latitude=77.1734,
                            longitude=31.1048,
                            temperature=15.0,
                            humidity=60,
                            wind_speed=5.0,
                            rainfall=0.0,
                            air_quality_index=50,
                            timestamp=datetime.datetime.now() - datetime.timedelta(hours=6)
                        )
                    ]
                ),
                "cyclone": DisasterData(
                    news_articles=[
                        NewsArticle(
                            article_id="news125",
                            title="Cyclone Approaches Mumbai Coast",
                            link="https://example.com/news/125",
                            description="A cyclone with wind speeds of 120 km/h is approaching Mumbai.",
                            content="A cyclone is expected to make landfall near Mumbai within 12 hours. Wind speeds are currently at 120 km/h, and a storm surge of 2.5m is predicted. Evacuations are in progress.",
                            pubDate=datetime.datetime.now() - datetime.timedelta(hours=4),
                            image_url="https://example.com/images/cyclone.jpg",
                            source_name="Weather Channel",
                            source_url="https://weather.com",
                            language="en",
                            country=["India"],
                            category=["disaster", "cyclone", "weather"],
                            sentiment="negative",
                            sentiment_stats={"negative": 0.80, "neutral": 0.15, "positive": 0.05},
                            ai_tag=["cyclone", "mumbai", "evacuation"]
                        )
                    ],
                    disaster_events=[
                        DisasterEvent(
                            event_id="cyc125",
                            event_type="cyclone",
                            severity=8.0,
                            geometry={
                                "type": "Point",
                                "coordinates": [72.8777, 19.0760]
                            },
                            affected_regions=["Mumbai", "Thane"],
                            timestamp=datetime.datetime.now() - datetime.timedelta(hours=4),
                            source="India Meteorological Department"
                        )
                    ],
                    ai_reports=[
                        AIReport(
                            report_id="ai125",
                            location="Mumbai",
                            latitude=72.8777,
                            longitude=19.0760,
                            summary="Cyclone approaching Mumbai with 120 km/h winds, affecting 1 million people.",
                            detailed_report="The cyclone is expected to cause significant wind damage and flooding due to a 2.5m storm surge. Coastal areas are at high risk.",
                            severity_index=8.0,
                            top_affected_areas={"Mumbai": 0.95, "Thane": 0.80}
                        )
                    ],
                    weather_data=[
                        WeatherData(
                            location_id="loc125",
                            location_name="Mumbai",
                            latitude=72.8777,
                            longitude=19.0760,
                            temperature=28.0,
                            humidity=85,
                            wind_speed=120.0,
                            rainfall=150.0,
                            air_quality_index=70,
                            timestamp=datetime.datetime.now() - datetime.timedelta(hours=2)
                        )
                    ]
                ),
                "wildfire": DisasterData(
                    news_articles=[
                        NewsArticle(
                            article_id="news126",
                            title="Wildfires Ravage Uttarakhand Forests",
                            link="https://example.com/news/126",
                            description="Wildfires have spread across 500 hectares in Uttarakhand.",
                            content="Wildfires in Uttarakhand have consumed 500 hectares of forest land. Air quality has deteriorated, and evacuations are underway in nearby villages.",
                            pubDate=datetime.datetime.now() - datetime.timedelta(hours=6),
                            image_url="https://example.com/images/wildfire.jpg",
                            source_name="Forest Department News",
                            source_url="https://forestnews.com",
                            language="en",
                            country=["India"],
                            category=["disaster", "wildfire"],
                            sentiment="negative",
                            sentiment_stats={"negative": 0.88, "neutral": 0.10, "positive": 0.02},
                            ai_tag=["wildfire", "uttarakhand", "evacuation"]
                        )
                    ],
                    disaster_events=[
                        DisasterEvent(
                            event_id="wf126",
                            event_type="wildfire",
                            severity=7.5,
                            geometry={
                                "type": "Polygon",
                                "coordinates": [[[78.0322, 30.3165], [78.0422, 30.3265], [78.0522, 30.3165], [78.0322, 30.3165]]]
                            },
                            affected_regions=["Dehradun", "Nainital"],
                            timestamp=datetime.datetime.now() - datetime.timedelta(hours=6),
                            source="Forest Department"
                        )
                    ],
                    ai_reports=[
                        AIReport(
                            report_id="ai126",
                            location="Dehradun",
                            latitude=78.0322,
                            longitude=30.3165,
                            summary="Wildfires in Uttarakhand affecting 10,000 people.",
                            detailed_report="The wildfires have spread across 500 hectares and are 20% contained. Air quality is unhealthy, with an AQI of 250.",
                            severity_index=7.5,
                            top_affected_areas={"Dehradun": 0.85, "Nainital": 0.65}
                        )
                    ],
                    weather_data=[
                        WeatherData(
                            location_id="loc126",
                            location_name="Dehradun",
                            latitude=78.0322,
                            longitude=30.3165,
                            temperature=35.0,
                            humidity=30,
                            wind_speed=20.0,
                            rainfall=0.0,
                            air_quality_index=250,
                            timestamp=datetime.datetime.now() - datetime.timedelta(hours=4)
                        )
                    ]
                ),
                "landslide": DisasterData(
                    news_articles=[
                        NewsArticle(
                            article_id="news127",
                            title="Landslide Blocks Roads in Shimla",
                            link="https://example.com/news/127",
                            description="A landslide in Shimla has blocked major roads after heavy rainfall.",
                            content="Heavy rainfall triggered a landslide in Shimla, blocking several roads and isolating villages. Rescue operations are in progress.",
                            pubDate=datetime.datetime.now() - datetime.timedelta(hours=10),
                            image_url="https://example.com/images/landslide.jpg",
                            source_name="Local News Shimla",
                            source_url="https://shimlanews.com",
                            language="en",
                            country=["India"],
                            category=["disaster", "landslide"],
                            sentiment="negative",
                            sentiment_stats={"negative": 0.87, "neutral": 0.10, "positive": 0.03},
                            ai_tag=["landslide", "shimla", "rescue"]
                        )
                    ],
                    disaster_events=[
                        DisasterEvent(
                            event_id="ls127",
                            event_type="landslide",
                            severity=6.5,
                            geometry={
                                "type": "Point",
                                "coordinates": [77.1734, 31.1048]
                            },
                            affected_regions=["Shimla"],
                            timestamp=datetime.datetime.now() - datetime.timedelta(hours=10),
                            source="Disaster Management Authority"
                        )
                    ],
                    ai_reports=[
                        AIReport(
                            report_id="ai127",
                            location="Shimla",
                            latitude=77.1734,
                            longitude=31.1048,
                            summary="Landslide in Shimla affecting 5,000 people.",
                            detailed_report="The landslide was triggered by 150mm of rainfall in the past 24 hours. Several roads are blocked, and there is a high risk of secondary landslides.",
                            severity_index=6.5,
                            top_affected_areas={"Shimla": 0.80}
                        )
                    ],
                    weather_data=[
                        WeatherData(
                            location_id="loc127",
                            location_name="Shimla",
                            latitude=77.1734,
                            longitude=31.1048,
                            temperature=18.0,
                            humidity=90,
                            wind_speed=10.0,
                            rainfall=150.0,
                            air_quality_index=60,
                            timestamp=datetime.datetime.now() - datetime.timedelta(hours=6)
                        )
                    ]
                )
            }

            # Get the disaster data for the requested type
            disaster_data = sample_data.get(disaster_type)
            if not disaster_data:
                return Response(
                    {"error": f"Invalid disaster type: {disaster_type}. Supported types: flood, earthquake, cyclone, wildfire, landslide"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Process the disaster data using the agent
            agent = DisasterResponseAgent()
            response = agent.process_disaster_data(disaster_data)

            # Convert the response to a dictionary and return it
            return Response(response.model_dump(), status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error processing disaster data: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Optional: Add a simple view to test the API
def test_disaster_data(request):
    """
    A simple view to test the disaster data processing
    """
    try:
        disaster_type = request.GET.get("disaster_type", "flood").lower()
        view = ProcessDisasterDataView()
        response = view.post(request={'disaster_type': disaster_type})
        return JsonResponse(response.data, status=response.status_code)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
