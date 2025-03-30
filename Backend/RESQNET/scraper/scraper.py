
import requests
from bs4 import BeautifulSoup
import logging
from datetime import datetime
from requests.exceptions import RequestException
from .models import ScrapedData

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def fetch_weather_data(location: str, lat: float, lon: float) -> dict:
    """
    Fetch weather data using OpenWeatherMap API
    """
    try:
        api_key = "d55d547b91de0a20cb0151bcf9f5cac7"  # Replace with your API key
        url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric"
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        data = response.json()
        return {
            "temperature": data["main"]["temp"],
            "humidity": data["main"]["humidity"],
            "wind_speed": data["wind"]["speed"],
            "rainfall": data.get("rain", {}).get("1h", 0.0)
        }
    except Exception as e:
        logger.error(f"Error fetching weather data: {str(e)}")
        return {"temperature": 25.0, "humidity": 80, "wind_speed": 5.0, "rainfall": 10.0}  # Mock data

def scrape_disaster_data(url: str, disaster_type: str, location: str, lat: float, lon: float) -> None:
    """
    Scrape disaster data from a website and save it to the database
    """
    title = "Mock Disaster Title"
    description = "Mock disaster description due to scraping failure."
    content = "Mock disaster content due to scraping failure."
    pub_date = datetime.now()

    try:
        # Send HTTP request to the website with headers
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Connection": "keep-alive"
        }
        response = requests.get(url, headers=headers, timeout=5)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        # Example scraping logic (adjust based on the website structure)
        title = soup.find('h1').text.strip() if soup.find('h1') else "No Title"
        description = soup.find('meta', attrs={'name': 'description'})['content'] if soup.find('meta', attrs={'name': 'description'}) else "No Description"
        content = soup.find('article').text.strip() if soup.find('article') else "No Content"
        pub_date = datetime.now()  # In a real scenario, parse the publication date from the website

    except RequestException as e:
        logger.error(f"Error scraping disaster data (RequestException): {str(e)}")
    except Exception as e:
        logger.error(f"Error scraping disaster data (Unexpected): {str(e)}")

    # Fetch weather data (already has error handling)
    weather_data = fetch_weather_data(location, lat, lon)

    # Save to database
    try:
        scraped_data = ScrapedData(
            data_id=f"scraped_{disaster_type}_{location}_{int(datetime.now().timestamp())}",
            source_url=url,
            title=title,
            description=description,
            content=content,
            pub_date=pub_date,
            location=location,
            latitude=lat,
            longitude=lon,
            disaster_type=disaster_type,
        )
        scraped_data.set_weather_data(weather_data)
        scraped_data.save()
        logger.info(f"Successfully scraped and saved data for {disaster_type} in {location}")
    except Exception as e:
        logger.error(f"Error saving scraped data to database: {str(e)}")
        raise

# Test the scraper
if __name__ == "__main__":
    test_url = "https://www.usnews.com/news/world/articles/2025-03-26/south-korea-is-in-uphill-battle-to-contain-massive-wildfires-as-the-death-toll-rises-to-26"  # # Use a simple URL for testing
    scrape_disaster_data(test_url, "flood", "East District", 85.123, 25.456)
