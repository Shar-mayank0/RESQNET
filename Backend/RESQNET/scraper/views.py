from django.shortcuts import render
import requests
from django.http import JsonResponse
from .models import DisasterAlert, DisasterRegion
from django.utils.timezone import now

def scrape_disaster_alerts(request):
    """
    Scrapes disaster alerts from the NDEM website (or any other source) and saves them to the database.
    """
    url = "https://example.com/disaster-alerts"  # Replace with the actual source
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()  # Assuming the data is in JSON format
        alerts_saved = 0
        
        for alert in data.get("alerts", []):
            # Skip entries with missing critical data
            if not all([alert.get("id"), alert.get("title"), alert.get("description"), alert.get("severity"), alert.get("location")]):
                continue  

            if not DisasterAlert.objects.filter(source_id=alert["id"]).exists():  # Avoid duplicates
                DisasterAlert.objects.create(
                    source_id=alert["id"],
                    title=alert["title"],
                    description=alert["description"],
                    severity=alert["severity"],
                    alert_type=alert.get("type", "General"),
                    location=alert["location"],
                    latitude=alert.get("latitude"),
                    longitude=alert.get("longitude"),
                    timestamp=now()
                )
                alerts_saved += 1
        
        return JsonResponse({"message": f"{alerts_saved} new alerts saved."}, status=201)
    else:
        return JsonResponse({"error": "Failed to fetch alerts"}, status=500)

def scrape_disaster_regions(request):
    """
    Scrapes disaster-affected regions and saves them to the database.
    """
    url = "https://example.com/affected-regions"  # Replace with actual source
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        regions_saved = 0
        
        for region in data.get("regions", []):
            # Skip entries with missing critical data
            if not all([region.get("name"), region.get("type"), region.get("latitude"), region.get("longitude")]):
                continue  

            if not DisasterRegion.objects.filter(name=region["name"]).exists():
                DisasterRegion.objects.create(
                    name=region["name"],
                    region_type=region["type"],
                    latitude=region["latitude"],
                    longitude=region["longitude"],
                    timestamp=now()
                )
                regions_saved += 1
        
        return JsonResponse({"message": f"{regions_saved} new regions saved."}, status=201)
    else:
        return JsonResponse({"error": "Failed to fetch regions"}, status=500)



