from django.db import models
# from django.contrib.gis.db import models
from django.db.models import  JSONField
from django.contrib.postgres.fields import ArrayField
import datetime
import json

class NewsArticle(models.Model):
    article_id = models.CharField(max_length=100, primary_key=True)
    title = models.CharField(max_length=255)
    link = models.URLField()
    description = models.TextField()
    content = models.TextField()
    pubDate = models.DateTimeField()
    image_url = models.URLField(null=True, blank=True)
    source_name = models.CharField(max_length=100)
    source_url = models.URLField()
    language = models.CharField(max_length=10)
    country = ArrayField(models.CharField(max_length=100))
    category = ArrayField(models.CharField(max_length=100))
    sentiment = models.CharField(max_length=20)
    sentiment_stats = JSONField()
    ai_tag = ArrayField(models.CharField(max_length=100))

    class Meta:
        app_label = 'scraper'

class DisasterEvent(models.Model):
    event_id = models.CharField(max_length=100, primary_key=True)
    event_type = models.CharField(max_length=50)
    severity = models.FloatField()
    geometry = models.JSONField()  # Store GeoJSON-like geometry data
    affected_regions = ArrayField(models.CharField(max_length=100))
    timestamp = models.DateTimeField()
    source = models.CharField(max_length=100)

    class Meta:
        app_label = 'scraper'

class AIReport(models.Model):
    report_id = models.CharField(max_length=100, primary_key=True)
    location = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()
    summary = models.TextField()
    detailed_report = models.TextField()
    severity_index = models.FloatField()
    top_affected_areas = JSONField()

    class Meta:
        app_label = 'scraper'

class WeatherData(models.Model):
    location_id = models.CharField(max_length=100, primary_key=True)
    location_name = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()
    temperature = models.FloatField()
    humidity = models.IntegerField()
    wind_speed = models.FloatField()
    rainfall = models.FloatField()
    air_quality_index = models.IntegerField()
    timestamp = models.DateTimeField()

    class Meta:
        app_label = 'scraper'

class DisasterData:
    def _init_(self, news_articles=None, disaster_events=None, ai_reports=None, weather_data=None):
        self.news_articles = news_articles or []
        self.disaster_events = disaster_events or []
        self.ai_reports = ai_reports or []
        self.weather_data = weather_data or []

    def model_dump_json(self, indent=None):
        return json.dumps({
            "news_articles": [article._dict_ for article in self.news_articles],
            "disaster_events": [event._dict_ for event in self.disaster_events],
            "ai_reports": [report._dict_ for report in self.ai_reports],
            "weather_data": [data._dict_ for data in self.weather_data]
        }, indent=indent, default=str)