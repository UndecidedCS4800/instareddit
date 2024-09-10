from django.shortcuts import render
from rest_framework import generics, views
from rest_framework.response import Response
from . import serializers, models
import bcrypt

# Create your views here.

# currently uses locally created 'dummy' table
class DummyListCreateView(generics.ListCreateAPIView):
    serializer_class = serializers.DummySerializer
    queryset = models.Dummy.objects.all()

class RegisterUserView(views.APIView):
    def post(self, request, *args, **kwargs):
        # get data from request
        username = request.data['username']
        email = request.data['email']
        pw = request.data['password']

        #hash password
        pw_bytes = pw.encode('utf-8')
        pw_hash = bcrypt.hashpw(pw_bytes, bcrypt.gensalt())

        #store user in DB #TODO match fields with final User model
        new_user = models.User(username=username, email=email, password_hash=pw_hash)
        new_user.save()

        #TODO generate token

        #TODO return token
        return Response("")
