from rest_framework import status, mixins, generics, views
from rest_framework.response import Response
from .. import serializers, models, pagination_classes
from .auth_views import requires_token
import os
import jwt
from datetime import datetime
from django.db.models import Q

#GET recent posts of users friends and communities
class RecentPostsView(generics.GenericAPIView, mixins.ListModelMixin):
    serializer_class = serializers.PostSerializer
    pagination_class = pagination_classes.StandardPostSetPagination

    @requires_token
    def get(self, request, **kwargs):
        #verify token
        decoded_token = kwargs['token']

        username = decoded_token['username']
        #get logged in user
        user = models.User.objects.get(username=username)

        # get friends and communties
        friends = user.friends.all()
        communities = user.member_communities.all()

        # get posts from friends & communties 
        posts = []
        for f in friends:
            posts.extend(f.post_set.all())
        for c in communities:
            posts.extend(c.post_set.all())

        # sort by date 
        self.queryset = sorted(posts, key=lambda p: p.datetime, reverse=True)
        print(self.queryset)

        return self.list(request)
    
#GET posts by user 
class UserPostsListView(generics.GenericAPIView, mixins.ListModelMixin):
    serializer_class = serializers.PostSerializer
    pagination_class = pagination_classes.StandardPostSetPagination

    def get(self, request, username):
        # check if user exists
        user = models.User.objects.filter(username=username).first()
        if not user:
            return Response({'error': "Username does not exist"}, status=status.HTTP_400_BAD_REQUEST)
        self.queryset = user.post_set.all().order_by('-datetime')

        return self.list(request)

#general view to get/update/delete post
class PostGetUpdateDestroyView(generics.GenericAPIView, mixins.UpdateModelMixin):
    def get_post(self, username, post_pk):
        user = models.User.objects.filter(username=username).first()
        if not user:
            return None
        return models.Post.objects.filter(Q(user=user), Q(id=post_pk)).first()

    def get(self, request, username, post_pk):
        post = self.get_post(username, post_pk)
        if not post:
            return Response({'error': 'Invalid username or post ID'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = serializers.PostSerializer(post)
        return Response(serializer.data)
    
    @requires_token
    def patch(self, request, username, post_pk, **kwargs):
        post = self.get_post(username, post_pk)
        if not post:
            return Response({'error': 'Invalid username or post ID'}, status=status.HTTP_400_BAD_REQUEST)
        decoded_token = kwargs['token']
        if decoded_token['username'] != username:
            return Response({'error': 'Unauthorized user'}, status=status.HTTP_401_UNAUTHORIZED)
        serializer = serializers.PostSerializer(post, data=request.data, partial=True)
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data)
        
    @requires_token
    def delete(self, request, username, post_pk, **kwargs):
        post = self.get_post(username, post_pk)
        if not post:
            return Response({'error': 'Invalid username or post ID'}, status=status.HTTP_400_BAD_REQUEST)
        decoded_token = kwargs['token']
        if decoded_token['username'] != username:
            return Response({'error': 'Unauthorized user'}, status=status.HTTP_401_UNAUTHORIZED)
        post.delete()
        return Response({}, status=status.HTTP_200_OK)


#general view to create a post
#POST /api/posts
#authorization stoken required
#required in body: text
#optional in body: image. community
class PostCreateView(views.APIView):
    @requires_token
    def post(self, request, **kwargs):
        #verify token
        decoded_token = kwargs['token']
        
        #get user data
        user_id = decoded_token['id']
        user = models.User.objects.get(id=user_id)

        #get body and create post
        body = request.data
        #check if post in community (commnunity optional)
        community_id = body.get('community', None)
        if community_id:
            community = models.Community.objects.filter(id=community_id).first()
        else:
            community = None
        #check if text provided
        text = body.get('text', None)
        if not text:
            return Response({'error': 'Post text not provided'}) 
        #check if image provided (image optional)   
        image = body.get('image', None)

        #create post instance
        new_post = models.Post(user=user, text=text, image=image, datetime=datetime.now(), community=community)
        new_post.save()

        #response
        response = serializers.PostSerializer(new_post).data
        return Response(response)
    
#post like on a post and get likes from a post
class PostLikesView(views.APIView):
    @requires_token
    def post(self, request,post_id, **kwargs):
        decoded_token = kwargs['token']
	#get the user
        user_id = decoded_token['id']
        try:
            user = models.User.objects.get(id = user_id)
        except models.User.DoesNotExist:
            return Response({'error': "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
	 #check if post exists
        try:
            post = models.Post.objects.get(id =post_id)
        except models.Post.DoesNotExist:
            return Response({'error': "Post not found"}, status=status.HTTP_404_NOT_FOUND)

        #check if the post is already liked by user
        if models.Like.objects.filter(user=user, post=post).exists():
            return Response({'error': "You have already liked this post"}, status=status.HTTP_400_BAD_REQUEST)
	 
        
	 #create like and save
        new_like = models.Like(user = user, post = post, datetime = datetime.now())
        new_like.save()
        
	 #create response
        response = serializers.LikeSerializer(new_like).data
        return Response(response)  
    
    def get(self, request, post_id):
        #check if post exists
        try:
            post = models.Post.objects.get(id=post_id)
        except models.Post.DoesNotExist:
            return Response({'error': "Post does not exist"}, status=status.HTTP_404_NOT_FOUND)
        likes = models.Like.objects.filter(post = post)
        serializer = serializers.LikeSerializer(likes, many = True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class DeleteLikesView(generics.DestroyAPIView):
    @requires_token
    def delete(self, request, post_id, like_id, **kwargs):
        decoded_token = kwargs['token']
        #get the user from the token
        user_id = decoded_token['id']
        user = models.User.objects.get(id = user_id)
        #check if post exists
        try:
            post = models.Post.objects.get(id=post_id)
        except models.Post.DoesNotExist:
            return Response({'error': "Post does not exist"}, status=status.HTTP_404_NOT_FOUND)
        #check if like exists
        try:
            like = models.Like.objects.get(post=post, id=like_id)
        except models.Like.DoesNotExist:
            return Response({'error': "Like does not exist"}, status=status.HTTP_404_NOT_FOUND)
        #make sure user created the like
        if like.user != user:
            return Response({'error': "You are not authorized to delete this like"}, status=status.HTTP_403_FORBIDDEN)
        #delete the like
        like.delete()
        return Response("like deleted", status=status.HTTP_200_OK)
        

#create dislike on a post
class PostDislikesView(views.APIView):
    @requires_token
    def post(self, request,post_id, **kwargs):
        decoded_token = kwargs['token']
	#get the user
        user_id = decoded_token['id']
        try:
            user = models.User.objects.get(id = user_id)
        except models.User.DoesNotExist:
            return Response({'error': "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
	 #check if post exists
        try:
            post = models.Post.objects.get(id =post_id)
        except models.Post.DoesNotExist:
            return Response({'error': "Post not found"}, status=status.HTTP_404_NOT_FOUND)

        #check if the post is already disliked by user
        if models.Dislike.objects.filter(user=user, post=post).exists():
            return Response({'error': "You have already disliked this post"}, status=status.HTTP_400_BAD_REQUEST)
	 
        
	 #create dislike and save
        new_dislike = models.Dislike(user = user, post = post, datetime = datetime.now())
        new_dislike.save()
        
	 #create response
        response = serializers.DislikeSerializer(new_dislike).data
        return Response(response) 
    
    def get(self, request, post_id):
        #check if post exists
        try:
            post = models.Post.objects.get(id=post_id)
        except models.Post.DoesNotExist:
            return Response({'error': "Post does not exist"}, status=status.HTTP_404_NOT_FOUND)
        dislikes = models.Dislike.objects.filter(post = post)
        serializer = serializers.DislikeSerializer(dislikes, many = True)
        return Response(serializer.data, status=status.HTTP_200_OK)   
    
class DeleteDislikesView(generics.DestroyAPIView):
    @requires_token
    def delete(self, request, post_id, dislike_id, **kwargs):
        decoded_token = kwargs['token']
        #get the user from token
        user_id = decoded_token['id']
        user = models.User.objects.get(id = user_id)
        #check if post exists
        try:
            post = models.Post.objects.get(id=post_id)
        except models.Post.DoesNotExist:
            return Response({'error': "Post does not exist"}, status=status.HTTP_404_NOT_FOUND)
        #check if the dislike exists
        try:
            dislike = models.Dislike.objects.get(post=post, id=dislike_id)
        except models.Dislike.DoesNotExist:
            return Response({'error': "Dislike does not exist"}, status=status.HTTP_404_NOT_FOUND)
        #make sure user created the dislike
        if dislike.user != user:
            return Response({'error': "You are not authorized to delete this dislike"}, status=status.HTTP_403_FORBIDDEN)
        #delete dislike
        dislike.delete()
        return Response("Dislike deleted", status=status.HTTP_200_OK)
    
#create comment on a post
class PostCommentView(views.APIView):
    @requires_token
    def post(self, request,post_id, **kwargs):
        decoded_token = kwargs['token']
	#get the user
        user_id = decoded_token['id']
        try:
            user = models.User.objects.get(id = user_id)
        except models.User.DoesNotExist:
            return Response({'error': "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        #get the comment from body
        body = request.data 
        comment = body.get('text')

        if not comment:
            return Response({'error': "comment is required"}, status=status.HTTP_400_BAD_REQUEST)

	#check if post exists
        try:
            post = models.Post.objects.get(id =post_id)
        except models.Post.DoesNotExist:
            return Response({'error': "Post not found"}, status=status.HTTP_404_NOT_FOUND)
 
	 #create comment and save
        new_comment = models.Comment(user = user, post = post,text = comment, datetime = datetime.now())
        new_comment.save()
        
	 #create response
        response = serializers.CommentSerializer(new_comment).data
        return Response(response)
    
    def get(self, request, post_id):
        #check if post exists
        try:
            post = models.Post.objects.get(id=post_id)
        except models.Post.DoesNotExist:
            return Response({'error': "Post does not exist"}, status=status.HTTP_404_NOT_FOUND)
        comments = models.Comment.objects.filter(post = post)
        serializer = serializers.CommentSerializer(comments, many = True)
        return Response(serializer.data, status=status.HTTP_200_OK)   


class DeleteCommentsView(generics.DestroyAPIView):
    @requires_token
    def delete(self, request, post_id, comment_id, **kwargs):
        decoded_token = kwargs['token']
        #get the user from token
        user_id = decoded_token['id']
        user = models.User.objects.get(id = user_id)
        #check if post exists
        try:
            post = models.Post.objects.get(id=post_id)
        except models.Post.DoesNotExist:
            return Response({'error': "Post does not exist"}, status=status.HTTP_404_NOT_FOUND)
        #check if the comment exists
        try:
            comment = models.Comment.objects.get(post=post, id=comment_id)
        except models.Comment.DoesNotExist:
            return Response({'error': "Comment does not exist"}, status=status.HTTP_404_NOT_FOUND)
        #make sure user created the comment or the user is the owner of the post
        if (comment.user == user or post.user == user):
        #delete dislike
            comment.delete()
            return Response("Comment deleted", status=status.HTTP_200_OK)
        else:
            return Response({'error': "You are not authorized to delete this comment"},status=status.HTTP_403_FORBIDDEN)

        