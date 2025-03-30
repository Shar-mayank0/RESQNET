from django.shortcuts import render
from django.http import JsonResponse

# Create your views here.


def home_test(request):
    return JsonResponse({'message': 'Hello, World! from initializer'})
