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
    owner_username = serializers.CharField(source='owner.username')
    admins = serializers.SerializerMethodField()
    def get_admins(self, obj):
        return [user.username for user in obj.admins.all()]
    class Meta:
        model = models.Community
        fields = ['id', 'name', 'description', 'picture', 'owner', 'owner_username', 'admins', 'num_members']

class PostSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    class Meta:
        model = models.Post
        fields = ['id', 'user', 'username', 'text', 'image', 'datetime', 'community']

class LikeSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    class Meta:
        model = models.Like
        fields = ['id', 'user', 'username', 'post' , 'datetime']
        
class DislikeSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    class Meta:
        model = models.Dislike
        fields = ['id', 'user', 'username', 'post' , 'datetime']
        
class CommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    class Meta:
        model = models.Comment
        fields = ['id', 'user', 'username', 'post' ,'text', 'datetime']
        
class RecentActivitySerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    class Meta:
        model = models.RecentActivity
        fields = ['id', 'user', 'username', 'post' ,'type', 'datetime']

class FriendRequestSerializer(serializers.ModelSerializer):
    from_username = serializers.CharField(source='from_user.username')
    to_username = serializers.CharField(source='to_user.username')
    class Meta:
        model = models.FriendRequest
        fields = ['id', 'from_user', 'from_username', 'to_user', 'to_username']
