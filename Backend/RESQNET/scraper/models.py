from django.db import models
import datetime
import json

# Model for scraped website and weather data
class ScrapedData(models.Model):
    data_id = models.CharField(max_length=100, primary_key=True)
    source_url = models.URLField()
    title = models.CharField(max_length=255)
    description = models.TextField()
    content = models.TextField()
    pub_date = models.DateTimeField()
    location = models.CharField(max_length=100)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    disaster_type = models.CharField(max_length=50)  # e.g., flood, earthquake
    weather_data = models.TextField(null=True, blank=True)  # Store JSON as a string
    scraped_at = models.DateTimeField(auto_now_add=True)

    def set_weather_data(self, data):
        self.weather_data = json.dumps(data)

    def get_weather_data(self):
        return json.loads(self.weather_data) if self.weather_data else {}

    class Meta:
        app_label = 'scraper'

# Model for Reddit posts
class RedditPost(models.Model):
    post_id = models.CharField(max_length=100, primary_key=True)
    title = models.CharField(max_length=255)
    text = models.TextField()
    author = models.CharField(max_length=100)
    created_at = models.DateTimeField()
    url = models.URLField()
    subreddit = models.CharField(max_length=100)
    score = models.IntegerField()
    disaster_type = models.CharField(max_length=50)  # e.g., flood, earthquake
    location = models.CharField(max_length=100, null=True, blank=True)
    fetched_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'scraper'

# Model for formatted data for BERT training
class FormattedDisasterData(models.Model):
    data_id = models.CharField(max_length=100, primary_key=True)
    disaster_type = models.CharField(max_length=50)
    location = models.CharField(max_length=100)
    combined_text = models.TextField()  # Combined text from scraped data and Reddit posts
    metadata = models.TextField()  # Store JSON as a string
    created_at = models.DateTimeField(auto_now_add=True)

    def set_metadata(self, data):
        self.metadata = json.dumps(data)

    def get_metadata(self):
        return json.loads(self.metadata) if self.metadata else {}

    class Meta:
        app_label = 'scraper'

# Model for AI-generated disaster report and action plan
class DisasterReport(models.Model):
    report_id = models.CharField(max_length=100, primary_key=True)
    disaster_type = models.CharField(max_length=50)
    location = models.CharField(max_length=100)
    detailed_report = models.TextField()
    action_plan = models.TextField()  # Store JSON as a string
    severity_index = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    def set_action_plan(self, data):
        self.action_plan = json.dumps(data)

    def get_action_plan(self):
        return json.loads(self.action_plan) if self.action_plan else []

    class Meta:
        app_label = 'scraper'
