from django.urls import path
from .views import analyze_reddit_post



urlpatterns = [
    path('', views.home_test, name='home_test'),
    path('analyze/', analyze_reddit_post, name='analyze_reddit_post'),
]