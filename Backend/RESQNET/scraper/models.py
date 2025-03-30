from django.db import models


class DisasterAlert(models.Model):
    ALERT_TYPES = [
        ('IMD', 'IMD Alert'),
        ('AVALANCHE', 'Avalanche'),
        ('WEATHER', 'Weather Alert'),
        ('SEISMIC', 'Earthquake'),
        ('FLOOD', 'Flood Alert'),
        ('NEWS', 'Disaster News'),
    ]

    alert_type = models.CharField(max_length=20, choices=ALERT_TYPES)
    source = models.CharField(max_length=100, help_text="Source of the alert (e.g., IMD, NDEM, CWC)")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    severity = models.CharField(max_length=50, blank=True, null=True)  # Example: Low, Moderate, High
    timestamp = models.DateTimeField()
    # location = models.PointField(geography=True, null=True, blank=True)  # Store centroid (if applicable)
    raw_data = models.JSONField(help_text="Full GeoJSON response")

    def __str__(self):
        return f"{self.get_alert_type_display()} - {self.title}"

    class Meta:
        ordering = ['-timestamp']


class DisasterRegion(models.Model):
    REGION_TYPES = [
        ('AVALANCHE', 'Avalanche Zone'),
        ('FLOOD', 'Flood Zone'),
        ('WAVE', 'High Wave Zone'),
        ('CURRENT', 'Ocean Current Zone'),
    ]

    region_type = models.CharField(max_length=20, choices=REGION_TYPES)
    description = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField()
    # geometry = models.PolygonField(geography=True)  # Store affected regions
    raw_data = models.JSONField(help_text="Full GeoJSON response")

    def __str__(self):
        return f"{self.get_region_type_display()} - {self.timestamp}"

    class Meta:
        ordering = ['-timestamp']
