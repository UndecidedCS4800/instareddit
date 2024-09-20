from rest_framework import serializers
from . import models

#General format for serializers (to convert object data to JSON)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = ['id', 'username', 'email', 'password_hash']

class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.UserInfo
        fields = ['user', 'first_name', 'last_name', 'date_of_birth', 'profile_picture']

class CommunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Community
        fields = ['id', 'name', 'description', 'picture', 'owner']

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Post
        fields = ['id', 'user', 'text', 'image', 'datetime', 'community']
        
class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Like
        fields = ['id', 'user', 'post' , 'datetime']
        
class DislikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Dislike
        fields = ['id', 'user', 'post' , 'datetime']
        
class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Comment
        fields = ['id', 'user', 'post' ,'text', 'datetime']
        
class RecentActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.RecentActivity
        fields = ['id', 'user', 'post' ,'type', 'datetime']
