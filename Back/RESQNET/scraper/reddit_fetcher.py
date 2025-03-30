import os
import praw
from datetime import datetime
import logging
from dotenv import load_dotenv
from .models import RedditPost

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

def fetch_reddit_posts(disaster_type: str, location: str) -> None:
    """
    Fetch Reddit posts related to the disaster type and location
    """
    try:
        # Initialize Reddit API
        reddit = praw.Reddit(
            client_id=REDDIT_CLIENT_ID,
            client_secret=REDDIT_CLIENT_SECRET,
            user_agent=REDDIT_USER_AGENT,
        )

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
        subreddit = reddit.subreddit(subreddit_str)

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

        # Fetch and save posts
        for submission in subreddit.search(query, limit=20, sort="new", time_filter="week"):
            if len(submission.title) < 10 or (submission.is_self and len(submission.selftext) < 20):
                continue

            title_lower = submission.title.lower()
            text_lower = submission.selftext.lower() if submission.is_self else submission.url.lower()
            relevance_score = sum(1 for keyword in keywords if keyword in title_lower or keyword in text_lower)
            if location.lower() in title_lower or location.lower() in text_lower:
                relevance_score += 2

            if relevance_score < 2:
                continue

            post = RedditPost(
                post_id=submission.id,
                title=submission.title,
                text=submission.selftext if submission.is_self else submission.url,
                author=str(submission.author),
                created_at=datetime.fromtimestamp(submission.created_utc),
                url=f"https://reddit.com{submission.permalink}",
                subreddit=submission.subreddit.display_name,
                score=submission.score,
                disaster_type=disaster_type,
                location=location
            )
            post.save()

        logger.info(f"Successfully fetched and saved Reddit posts for {disaster_type} in {location}")

    except Exception as e:
        logger.error(f"Error fetching Reddit posts: {str(e)}")
        raise

# Test the fetcher
if __name__ == "__main__":
    fetch_reddit_posts("flood", "East District")
