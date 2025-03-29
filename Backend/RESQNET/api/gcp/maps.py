import os
import requests
from django.conf import settings
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

API_KEY = os.getenv("GCP_API_KEY")
gmaps = "https://places.googleapis.com/v1/places:searchNearby"

class GCPMaps:
    def __init__(self):
            pass

    def get_nearby_places_all_data(long, lat, radius=1000, keyword=[None]):
        req_params = {
            "includedTypes": [keyword],
            "maxResultCount": 10,
            "locationRestriction": {
                "circle": {
                    "center": {
                        "latitude": lat,
                        "longitude": long
                    },
                    "radius": float(radius)
                }
            }
        }

        headers = {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': API_KEY,
            'X-Goog-FieldMask': '*'
        }

        response = requests.post(gmaps, headers=headers, json=req_params)
        if response.status_code == 200:
            # Assuming the API returns a JSON response
            return response.json()
        else:
            return None


