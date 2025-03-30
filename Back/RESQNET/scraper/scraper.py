import requests
from bs4 import BeautifulSoup
import logging
from datetime import datetime
from .models import ScrapedData
import json

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
class DisasterDataScraper():

    def fetch_weather_data(location: str, lat: float, lon: float) -> dict:
        """
        Fetch weather data using OpenWeatherMap API
        """
        try:
            api_key = "d55d547b91de0a20cb0151bcf9f5cac7"  # Replace with your API key
            url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric"
            headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
            response = requests.get(url, params={}, headers=headers)
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
            return {}

    def scrape_disaster_data(url: str, disaster_type: str, location: str, lat: float, lon: float) -> None:
        """
        Scrape disaster data from a website and save it to the database
        """
        try:
            # Send HTTP request to the website
            response = requests.get(url)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')

            # Example scraping logic (adjust based on the website structure)
            title = soup.find('h1').text.strip() if soup.find('h1') else "No Title"
            description = soup.find('meta', attrs={'name': 'description'})['content'] if soup.find('meta', attrs={'name': 'description'}) else "No Description"
            content = soup.find('article').text.strip() if soup.find('article') else "No Content"
            pub_date = datetime.now()  # In a real scenario, parse the publication date from the website

            # Fetch weather data
            weather_data = fetch_weather_data(location, lat, lon)

            # Save to database
            scraped_data = ScrapedData(
                data_id=f"scraped_{disaster_type}_{location}_{int(datetime.now().timestamp())}",
                title=title,
                description=description,
                content=content,
                pub_date=pub_date,
                location=location,
                latitude=lat,
                longitude=lon,
                disaster_type=disaster_type,
            )
            scraped_data.set_weather_data(weather_data)  # Use helper method
            scraped_data.save()
            logger.info(f"Successfully scraped and saved data for {disaster_type} in {location}")

        except Exception as e:
            logger.error(f"Error scraping disaster data: {str(e)}")
            raise

    def scrape_ndem_data():
        """
        Scrape NDEM data from a website and save it to the database
        """
        try:
            # Send HTTP request to the NDEM website
            url = "https://ndem.nrsc.gov.in/documents/ndemV5/API/dbFetch.php?module=getWarnings"  # Replace with the actual NDEM URL
            response = requests.get(url)
            if response.status_code != 200:
                response.raise_for_status()
                return
            return response.json()
        except Exception as e:
            logger.error(f"Error scraping NDEM data: {str(e)}")
            raise
# Test the scraper
if __name__ == "__main__":
    test_url = "https://www.usnews.com/news/world/articles/2025-03-26/south-korea-is-in-uphill-battle-to-contain-massive-wildfires-as-the-death-toll-rises-to-26"  # Replace with a real disaster news website
    scrape_disaster_data(test_url, "flood", "East District", 85.123, 25.456)
