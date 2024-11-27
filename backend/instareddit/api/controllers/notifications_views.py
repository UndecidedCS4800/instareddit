from rest_framework import views, status, generics
from rest_framework.response import Response
from .auth_views import requires_token
from .. import models, serializers

class NotificationsGetLikesViews(views.APIView):
    @requires_token
    def get(self, request, **kwargs):
        #verify token
        decoded_token = kwargs['token']
        #get user
        user_id = decoded_token['id']
        user = models.User.objects.filter(id=user_id).first()
        if not user:
            return Response({'error': 'Invalid user ID'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get all post IDs for the user
        posts = models.Post.objects.filter(user=user).values_list('id', flat=True)
        
       # Get all likes for the user's posts
        likes = models.Like.objects.filter(post__in=posts).select_related('user', 'post')
        
	 # Prepare response data
        response = [
            {
                'username': like.user.username,
                'post_id': like.post.id,
                'community_id': like.post.community.id,
                'when': int(like.datetime.timestamp())
            }
            for like in likes
        ]
        
        return Response(response, status=status.HTTP_200_OK)
    
class NotificationsGetCommentsViews(views.APIView):
    @requires_token
    def get(self, request, **kwargs):
        #verify token
        decoded_token = kwargs['token']
        #get user
        user_id = decoded_token['id']
        user = models.User.objects.filter(id=user_id).first()
        if not user:
            return Response({'error': 'Invalid user ID'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get all post IDs for the user
        posts = models.Post.objects.filter(user=user).values_list('id', flat=True)
        
       # Get all comments for the user's posts
        comments = models.Comment.objects.filter(post__in=posts).select_related('user', 'post')
        
	 # Prepare response data
        response = [
            {
                'username': comment.user.username,
                'post_id': comment.post.id,
                'community_id': comment.post.community.id,
                'when': int(comment.datetime.timestamp())
            }
            for comment in comments
        ]
        
        return Response(response, status=status.HTTP_200_OK)
       