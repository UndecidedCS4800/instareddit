from django.shortcuts import render
from rest_framework import generics
from . import serializers, models

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

class LikeListCreateView(generics.ListCreateAPIView):
    serializer_class = serializers.LikeSerializer
    queryset = models.Like.objects.all()

class DislikeListCreateView(generics.ListCreateAPIView):
    serializer_class = serializers.DislikeSerializer
    queryset = models.Dislike.objects.all()

class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = serializers.CommentSerializer
    queryset = models.Comment.objects.all()

class RecentActivityListCreateView(generics.ListCreateAPIView):
    serializer_class = serializers.RecentActivitySerializer
    queryset = models.RecentActivity.objects.all()