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
			return Response("Invalid Username",status=status.HTTP_400_BAD_REQUEST)

		user_info = models.UserInfo.objects.filter(user = profile).first()
		if user_info is None:
			return Response("No user info for given username", status = status.HTTP_400_BAD_REQUEST)
		serializer = serializers.UserInfoSerializer(user_info)
		return Response(serializer.data,status=status.HTTP_200_OK)

#get profile of the currently logged in user
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
                return Response("Invalid Username", status=status.HTTP_400_BAD_REQUEST)
            
            # Check if user info exists
            user_info = models.UserInfo.objects.filter(user=user).first()
            if user_info is None:
                return Response("Invalid User info", status=status.HTTP_400_BAD_REQUEST)
            
            # Serialize the user info and return it
            serializer = serializers.UserInfoSerializer(user_info)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except jwt.InvalidTokenError:
            return Response("Invalid token", status=status.HTTP_401_UNAUTHORIZED)
        
			