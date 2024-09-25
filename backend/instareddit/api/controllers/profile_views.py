from rest_framework import views, status
from rest_framework.response import Response
from django.shortcuts import redirect
from .. import serializers, models
from . import auth_views

#get profile from username
class ProfileView(views.APIView):
	def get(self, request, username):
		profile = models.User.objects.filter(username = username).first()
		if profile is None:
			return Response("Invalid Username",status=status.HTTP_400_BAD_REQUEST)

		user_info = models.UserInfo.objects.filter(user = profile).first()
		if user_info is None:
			return Response("Invalid User info", status = status.HTTP_400_BAD_REQUEST)
		serializer = serializers.UserInfoSerializer(user_info)
		return Response(serializer.data,status=status.HTTP_200_OK)




	

