from rest_framework import status, mixins, generics
from rest_framework.response import Response
from .. import serializers, models, pagination_classes
from .auth_views import verify_token
import os
import jwt

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

#general view to create a post
#POST /api/posts
class PostCreateView(generics.CreateAPIView):
    queryset = models.Post.objects.all()
    serializer_class = serializers.PostSerializer
