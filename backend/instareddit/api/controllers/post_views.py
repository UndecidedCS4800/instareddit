from rest_framework import status, mixins, generics, views
from rest_framework.response import Response
from .. import serializers, models, pagination_classes
from .auth_views import verify_token
import os
import jwt
from datetime import datetime

#GET recent posts of users friends and communities
class RecentPostsView(generics.GenericAPIView, mixins.ListModelMixin):
    serializer_class = serializers.PostSerializer
    pagination_class = pagination_classes.StandardPostSetPagination

    def get(self, request):
        #verify token
        token = verify_token(request)
        if not token:
            return Response({'error': "Token not provided or invalid (must start with 'bearer ')"}, status=status.HTTP_401_UNAUTHORIZED)
        
        #get username from token
        try:
            decoded_token = jwt.decode(token, os.environ.get('TOKEN_KEY'), algorithms=['HS256'])
        except (jwt.DecodeError, jwt.InvalidTokenError, jwt.InvalidSignatureError):
            return Response({'error': "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
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
class PostGetUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Post.objects.all()
    serializer_class = serializers.PostSerializer
    lookup_field = 'pk'

    def put(self, request, *args, **kwargs):
        token = verify_token(request)
        if not token:
            return Response({'error': "Token not provided or invalid (must start with 'bearer ')"}, status=status.HTTP_401_UNAUTHORIZED)
        return self.update(request, args, kwargs)
    def delete(self, request, *args, **kwargs):
        token = verify_token(request)
        if not token:
            return Response({'error': "Token not provided or invalid (must start with 'bearer ')"}, status=status.HTTP_401_UNAUTHORIZED)
        return self.destroy(request, *args, **kwargs)

#general view to create a post
#POST /api/posts
class PostCreateView(views.APIView):
    def post(self, request):
        #verify token
        token = verify_token(request)
        if not token:
            return Response({'error': "Token not provided or invalid (must start with 'bearer ')"}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            decoded_token = jwt.decode(token, os.environ.get('TOKEN_KEY'), algorithms=['HS256'])
        except (jwt.DecodeError, jwt.InvalidTokenError, jwt.InvalidSignatureError):
            return Response({'error': "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
        
        #get user data
        user_id = decoded_token['id']
        user = models.User.objects.get(id=user_id)

        #get body and create post
        body = request.data
        community_id = body.get('community', None)
        if community_id:
            community = models.Community.objects.filter(id=community_id).first()
        else:
            community = None
        new_post = models.Post(user=user, text=body['text'], image=body['image'], datetime=datetime.now(), community=community)
        new_post.save()

        #response
        response = serializers.PostSerializer(new_post).data
        return Response(response)
    
#create like on a post
class PostLikesView(views.APIView):
    def post(self, request,post_id):
        token = verify_token(request)
        if not token:
            return Response({'error': "Token not provided or invalid (must start with 'bearer ')"}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            decoded_token = jwt.decode(token, os.environ.get('TOKEN_KEY'), algorithms=['HS256'])
        except (jwt.DecodeError, jwt.InvalidTokenError, jwt.InvalidSignatureError):
            return Response({'error': "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
	#get the user
        user_id = decoded_token['id']
        try:
            user = models.User.objects.get(id = user_id)
        except models.User.DoesNotExist:
            return Response({'error': "User not found"}, staus=status.HTTP_404_NOT_FOUND)
        
        if not post_id:
            return Response({'error': "post id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            post = models.Post.objects.get(id =post_id)
        except models.Post.DoesNotExist:
            return Response({'error': "Post not found"}, staus=status.HTTP_404_NOT_FOUND)

        #check if the post is already liked by user
        if models.Like.objects.filter(user=user, post=post).exists():
            return Response({'message': "You have already liked this post"}, status=status.HTTP_400_BAD_REQUEST)
	 
        
	 #create like and save
        new_like = models.Like(user = user, post = post, datetime = datetime.now())
        new_like.save()
        
	 #create response
        response = serializers.LikeSerializer(new_like).data
        return Response(response)  

#create dislike on a post
class PostDislikesView(views.APIView):
    def post(self, request,post_id):
        token = verify_token(request)
        if not token:
            return Response({'error': "Token not provided or invalid (must start with 'bearer ')"}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            decoded_token = jwt.decode(token, os.environ.get('TOKEN_KEY'), algorithms=['HS256'])
        except (jwt.DecodeError, jwt.InvalidTokenError, jwt.InvalidSignatureError):
            return Response({'error': "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
	#get the user
        user_id = decoded_token['id']
        try:
            user = models.User.objects.get(id = user_id)
        except models.User.DoesNotExist:
            return Response({'error': "User not found"}, staus=status.HTTP_404_NOT_FOUND)
        

        if not post_id:
            return Response({'error': "post id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            post = models.Post.objects.get(id =post_id)
        except models.Post.DoesNotExist:
            return Response({'error': "Post not found"}, staus=status.HTTP_404_NOT_FOUND)

        #check if the post is already disliked by user
        if models.Dislike.objects.filter(user=user, post=post).exists():
            return Response({'message': "You have already disliked this post"}, status=status.HTTP_400_BAD_REQUEST)
	 
        
	 #create dislike and save
        new_dislike = models.Dislike(user = user, post = post, datetime = datetime.now())
        new_dislike.save()
        
	 #create response
        response = serializers.DislikeSerializer(new_dislike).data
        return Response(response)    
    
#create comment on a post
class PostCommentView(views.APIView):
    def post(self, request,post_id):
        token = verify_token(request)
        if not token:
            return Response({'error': "Token not provided or invalid (must start with 'bearer ')"}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            decoded_token = jwt.decode(token, os.environ.get('TOKEN_KEY'), algorithms=['HS256'])
        except (jwt.DecodeError, jwt.InvalidTokenError, jwt.InvalidSignatureError):
            return Response({'error': "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
	#get the user
        user_id = decoded_token['id']
        try:
            user = models.User.objects.get(id = user_id)
        except models.User.DoesNotExist:
            return Response({'error': "User not found"}, staus=status.HTTP_404_NOT_FOUND)
        
        #get the post id from body
        body = request.data 
        comment = body.get('text')

        if not post_id:
            return Response({'error': "post id is required"}, status=status.HTTP_400_BAD_REQUEST)
        if not comment:
            return Response({'error': "comment is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            post = models.Post.objects.get(id =post_id)
        except models.Post.DoesNotExist:
            return Response({'error': "Post not found"}, staus=status.HTTP_404_NOT_FOUND)
 
	 #create comment and save
        new_comment = models.Comment(user = user, post = post,text = comment, datetime = datetime.now())
        new_comment.save()
        
	 #create response
        response = serializers.CommentSerializer(new_comment).data
        return Response(response)   

