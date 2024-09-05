from rest_framework import serializers
from .models import *

class DummySerializer(serializers.ModelSerializer):
    class Meta:
        model = Dummy
        fields = ['id', 'name']