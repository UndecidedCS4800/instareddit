from django.shortcuts import render
from django.utils.datastructures import MultiValueDictKeyError
from rest_framework import generics, views, status
from rest_framework.response import Response
from . import serializers, models
import bcrypt
import jwt

# Create your views here.

# currently uses locally created 'dummy' table
class DummyListCreateView(generics.ListCreateAPIView):
    serializer_class = serializers.DummySerializer
    queryset = models.Dummy.objects.all()

#registers a new user
#request should be POST with body containing username, email, and password
class RegisterUserView(views.APIView):
    def post(self, request, *args, **kwargs):
        # get data from request, return error status if data incomplete
        try: 
            #try getting these from request body
            username = request.data['username']
            email = request.data['email']
            password = request.data['password']
        except MultiValueDictKeyError:
            return Response("Incomplete user data", status=status.HTTP_400_BAD_REQUEST)


        #check if user already exists, return error status if user already exists
        try:
            models.User.objects.get(username=username)
            models.User.objects.get(email=email)
            return Response("User with this email or username already exists.", status=status.HTTP_400_BAD_REQUEST)
        except models.User.DoesNotExist:
            #if user doesn't exist, this will be executed and the code will continue
            pass    

        #hash password
        pw_bytes = password.encode('utf-8')
        pw_hash = bcrypt.hashpw(pw_bytes, bcrypt.gensalt())

        #store user in DB 
        #TODO match fields with final User model
        new_user = models.User(username=username, email=email, password_hash=pw_hash)
        new_user.save()

        #generate token
        key = "secret" #TODO change
        token = jwt.encode({'username':username}, key, algorithm='HS256') #TODO what to encode? currently username

        response = {'username' : username, 'token': token} #TODO check if right format
        return Response(response, status=status.HTTP_201_CREATED)
