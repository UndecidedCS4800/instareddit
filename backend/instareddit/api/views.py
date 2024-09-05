from django.shortcuts import render
from rest_framework import generics
from . import serializers, models

# Create your views here.

# currently uses locally created 'dummy' table
class DummyListCreateView(generics.ListCreateAPIView):
    serializer_class = serializers.DummySerializer
    queryset = models.Dummy.objects.all()