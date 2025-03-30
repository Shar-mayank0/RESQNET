from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import logging
from .scraper import DisasterDataScraper
from .reddit_fetcher import fetch_reddit_posts
from .ai_agent import DisasterDataAgent
from .bert_trainer import train_bert_model
from .report_generator import ReportGeneratorAgent

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ProcessDisasterDataView(APIView):
    """
    API view to process disaster data and generate a report
    """
    def post(self, request):
        try:
            disaster_type = request.data.get("disaster_type", "flood").lower()
            location = request.data.get("location", "East District")
            url = request.data.get("url", "https://example.com")
            lat = float(request.data.get("lat", 85.123))
            lon = float(request.data.get("lon", 25.456))

            # Step 1: Scrape website and weather data
            DisasterDataScraper.scrape_ndem_data()

            # Step 2: Fetch Reddit posts
            fetch_reddit_posts(disaster_type, location)

            # Step 3: Combine and format data
            agent = DisasterDataAgent()
            formatted_data = agent.combine_and_format_data(disaster_type, location)

            # Step 4: Train BERT model and get best data sets
            best_data = train_bert_model(disaster_type, location)

            # Step 5: Generate report
            report_agent = ReportGeneratorAgent()
            report = report_agent.generate_report(best_data, disaster_type, location)

            return Response(report, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error processing disaster data: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
