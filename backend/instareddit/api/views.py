from django.shortcuts import render
from django.utils.datastructures import MultiValueDictKeyError
from rest_framework import generics, views, status
from rest_framework.response import Response
from . import serializers, models, forms
import bcrypt
import jwt
import os

SALT = bcrypt.gensalt()

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
        if models.User.objects.filter(username=username).exists() or models.User.objects.filter(email=email).exists():
            return Response("User with this email or username already exists.", status=status.HTTP_400_BAD_REQUEST)

        #hash password
        pw_bytes = password.encode('utf-8') #convert to bytes
        pw_hash = bcrypt.hashpw(pw_bytes, SALT)
        pw_hash = pw_hash.decode('utf-8') #convert hashed password back to string to store in DB

        #store user in DB 
        #TODO match fields with final User model
        new_user = models.User(username=username, email=email, password_hash=pw_hash)
        new_user.save()

        #generate token
        key = os.environ.get('TOKEN_KEY')
        token = jwt.encode({'username': username}, key, algorithm='HS256')

        response = {'username': username, 'token': token}
        return Response(response, status=status.HTTP_201_CREATED)

class LoginView(views.APIView):
    def post(self, request, *args, **kwargs):
        #validate data with form
        form = forms.UserLoginForm(request.data)
        if not form.is_valid(): 
            return Response("Incomplete or incorrect user data", status=status.HTTP_400_BAD_REQUEST)
        # get data
        username = form.cleaned_data['username']
        password = form.cleaned_data['password']
        pw_bytes = password.encode('utf-8') #convert password to bytes
        
        # Check if user exists already
        if not models.User.objects.filter(username=username).exists():
            return Response("User with this username does not exist", status=status.HTTP_400_BAD_REQUEST)
        
        #get user and password hash from DB
        user = models.User.objects.get(username=username)
        hashpass = user.password_hash
        hashpass_bytes = hashpass.encode('utf-8') # convert hashed pw to bytes
          
        # check if password matches the hashed pw from db
        if bcrypt.checkpw(pw_bytes, hashpass_bytes):
            key = os.environ.get('TOKEN_KEY')
            token = jwt.encode({'username': username}, key, algorithm='HS256')
            response = {'username': username, 'token': token}
            return Response(response, status=status.HTTP_200_OK)
        else:
            return Response("Incorrect password", status=status.HTTP_401_UNAUTHORIZED)

#general format to GET all instances or POST a new one
class UserListCreateView(generics.ListCreateAPIView):
    serializer_class = serializers.UserSerializer
    queryset = models.User.objects.all()

class UserInfoListCreateView(generics.ListCreateAPIView):
    serializer_class = serializers.UserInfoSerializer
    queryset = models.UserInfo.objects.all()

class CommunityListCreateView(generics.ListCreateAPIView):
    serializer_class = serializers.CommunitySerializer
    queryset = models.Community.objects.all()

class PostListCreateView(generics.ListCreateAPIView):
    serializer_class = serializers.PostSerializer
    queryset = models.Post.objects.all()