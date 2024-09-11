from django.shortcuts import render
from django.utils.datastructures import MultiValueDictKeyError
from rest_framework import generics, views, status
from rest_framework.response import Response
from . import serializers, models, forms
import bcrypt
import jwt
import os

# Create your views here.

# currently uses locally created 'dummy' table
class DummyListCreateView(generics.ListCreateAPIView):
    serializer_class = serializers.DummySerializer
    queryset = models.Dummy.objects.all()

#registers a new user
#request should be POST with body containing username, email, and password
class RegisterUserView(views.APIView):
    def post(self, request, *args, **kwargs):
        # get data from request, validate form and return error status if data incomplete
        form = forms.UserRegisterForm(request.data)
        if not form.is_valid(): 
              return Response("Incomplete or incorrect user data", status=status.HTTP_400_BAD_REQUEST)
        username = form.cleaned_data['username']
        email = form.cleaned_data['email']
        password = form.cleaned_data['password']

        # check if user already exists
        if models.User.objects.filter(username=username, email=email).exists():
            return Response("User with this email or username already exists.", status=status.HTTP_400_BAD_REQUEST)

        #hash password
        pw_bytes = password.encode('utf-8') #convert to bytes
        salt = bcrypt.gensalt(10)
        pw_hash = bcrypt.hashpw(pw_bytes, salt)
        pw_hash= str(pw_hash)
        

        #store user in DB 
        #TODO match fields with final User model
        new_user = models.User(username=username, email=email, password_hash=pw_hash)
        new_user.save()

        #generate token
        key = os.environ.get('TOKEN_KEY')
        token = jwt.encode({'username': username}, key, algorithm='HS256') #TODO what to encode? currently username

        response = {'username': username, 'token': token}
        return Response(response, status=status.HTTP_201_CREATED)

#TODO
class LoginView(views.APIView):
    def post(self, request, *args, **kwargs):
        form = forms.UserLoginForm(request.data)
        
        if not form.is_valid(): 
            return Response("Incomplete or incorrect user data", status=status.HTTP_400_BAD_REQUEST)
        
	 
        username = form.cleaned_data['username']
        password = form.cleaned_data['password']
        pw_bytes = password.encode('utf-8')
        
        
        
        # Check if user exists already
        if not models.User.objects.filter(username=username).exists():
            return Response("User with this username does not exist", status=status.HTTP_400_BAD_REQUEST)
        
        user = models.User.objects.get(username=username)
        hashpass = user.password_hash

        #testpassword = 'secret'
        #testpassword = testpassword.encode('utf-8')
        #salt = bcrypt.gensalt(10)
        #hashtest = bcrypt.hashpw(testpassword, salt)
        #hashtest = str(hashtest)
        
        
        if bcrypt.checkpw(pw_bytes, hashpass):
            key = os.environ.get('TOKEN_KEY')
            token = jwt.encode({'username': username}, key, algorithm='HS256')
            response = {'username': username, 'token': token}
            return Response(response, status=status.HTTP_200_OK)
        else:
            return Response("Incorrect password", status=status.HTTP_401_UNAUTHORIZED)
