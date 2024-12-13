from rest_framework import views, status
from rest_framework.response import Response
from .. import serializers, models
from .auth_views import verify_token
import jwt
import os

#get profile from username
class ProfileView(views.APIView):
	def get(self, request, username):
		profile = models.User.objects.filter(username = username).first()
		if profile is None:
			return Response({'error' : "Invalid Username"},status=status.HTTP_404_NOT_FOUND)

		user_info = models.UserInfo.objects.filter(user = profile).first()
		if user_info is None:
			return Response({'error' : "No user info for given username"}, status = status.HTTP_404_NOT_FOUND)
		serializer = serializers.UserInfoSerializer(user_info)
		return Response(serializer.data,status=status.HTTP_200_OK)
          

#get profile of the currently logged in use
#post user info
class SelfProfileView(views.APIView):
    def get(self, request):
        # Get the token from the request
        token = verify_token(request)
        if not token:
            return Response({'error': "Token not provided or invalid (must start with 'bearer ')"}, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            # Decode the token
            decoded_token = jwt.decode(token, os.environ.get('TOKEN_KEY'), algorithms=['HS256'])
            username = decoded_token['username']
            
            # Check if the user exists
            user = models.User.objects.filter(username=username).first()
            if user is None:
                return Response({'error': "User does not exist"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if user info exists
            user_info = models.UserInfo.objects.filter(user=user).first()
            if user_info is None:
                return Response({'error': "User info does not exist"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Serialize the user info and return it
            serializer = serializers.UserInfoSerializer(user_info)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except jwt.InvalidTokenError:
            return Response({'error': "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)

    def post(self, request):
        # Get the token from the request
        token = verify_token(request)
        if not token:
            return Response({'error': "Token not provided or invalid (must start with 'bearer ')"}, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            # Decode the token
            decoded_token = jwt.decode(token, os.environ.get('TOKEN_KEY'), algorithms=['HS256'])
        except (jwt.DecodeError, jwt.InvalidTokenError, jwt.InvalidSignatureError):
            return Response({'error': "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Get the user
        user_id = decoded_token.get('id')
        try:
            user = models.User.objects.get(id=user_id)
        except models.User.DoesNotExist:
            return Response({'error': "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Check if user info for the user already exists
        if models.UserInfo.objects.filter(user=user).exists():
            return Response({'error': "User already has information"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get the user information from request
        body = request.data
        first_name = body.get('first_name', None)
        if not first_name:
            return Response({'error': "First Name not provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        last_name = body.get('last_name', None)
        if not last_name:
            return Response({'error': "Last Name not provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        date_of_birth = body.get('date_of_birth', None)
        if not date_of_birth:
            return Response({'error': "Date of Birth not provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        profile_picture = body.get('profile_picture', None)
        
        # Create new user info
        new_userinfo = models.UserInfo(
            user=user,
            first_name=first_name,
            last_name=last_name,
            date_of_birth=date_of_birth,
            profile_picture=profile_picture
        )
        new_userinfo.save()

        # Serialize and return the new user info
        response = serializers.UserInfoSerializer(new_userinfo).data
        return Response(response, status=status.HTTP_201_CREATED)
    
    def put(self, request):
         # Get the token from the request
        token = verify_token(request)
        if not token:
            return Response({'error': "Token not provided or invalid (must start with 'bearer ')"}, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            # Decode the token
            decoded_token = jwt.decode(token, os.environ.get('TOKEN_KEY'), algorithms=['HS256'])
        except (jwt.DecodeError, jwt.InvalidTokenError, jwt.InvalidSignatureError):
            return Response({'error': "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Get the user
        user_id = decoded_token.get('id')
        try:
            user = models.User.objects.get(id=user_id)
        except models.User.DoesNotExist:
            return Response({'error': "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        try:
             userinfo = models.UserInfo.objects.get(user = user)
        except models.UserInfo.DoesNotExist:
             return Response({'error': "User Info not found"}, status=status.HTTP_404_NOT_FOUND)
        
        data = request.data.copy()
        data.pop('user', None)  # Remove 'user' if present
        
        serializer = serializers.UserInfoSerializer(userinfo, data = data)
        if serializer.is_valid():
             serializer.save()
             return Response(serializer.data, status=status.HTTP_200_OK)
        else:
             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
         

        
			