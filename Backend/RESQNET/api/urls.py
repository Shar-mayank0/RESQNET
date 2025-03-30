from django.urls import path
from . import views

urlpatterns = [
  path('process-disaster-data/', views.ProcessDisasterDataView.as_view(), name='process_disaster_data'),
    path('test-disaster-data/', views.test_disaster_data, name='test_disaster_data'),
]
