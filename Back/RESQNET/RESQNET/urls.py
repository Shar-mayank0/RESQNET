from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from scraper.views import ProcessDisasterDataView
from django.http import HttpResponse  # Import HttpResponse for a simple view

# Simple view for the root path
def home(request):
    return HttpResponse("Welcome to RESQNET! Use the /process-disaster-data/ endpoint to process disaster data.")

urlpatterns = [
    path('', home, name='home'),  # Add root path
    path('process-disaster-data/', ProcessDisasterDataView.as_view(), name='process_disaster_data'),
] + static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])
