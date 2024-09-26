from rest_framework import views, status
from rest_framework.response import Response
from .. import serializers, models
from .auth_views import verify_token
import os
import jwt

#GET recent posts of users friends and communities
class RecentPostsView(views.APIView):
    def get(self, request):
        
        token = verify_token(request)
        
        if not token:
            return Response("Token not provided or invalid (must start with 'bearer ')", status=status.HTTP_401_UNAUTHORIZED)
        
        #get username from token
        try:
            decoded_token = jwt.decode(token, os.environ.get('TOKEN_KEY'), algorithms=['HS256'])
        except (jwt.DecodeError, jwt.InvalidTokenError, jwt.InvalidSignatureError):
            return Response("Invalid token", status=status.HTTP_401_UNAUTHORIZED)
        username = decoded_token['username']
        #get logged in user
        user = models.User.objects.get(username=username)

        # get friends and communties
        friends = user.friends.all()
        communities = user.member_communities.all()

        # get number to start at if provided
        begin_at = int(request.query_params.get('begin_at', 0))
        
        # get posts from friends & communties 
        posts = []
        for f in friends:
            posts.extend(f.post_set.all())
        for c in communities:
            posts.extend(c.post_set.all())

        # sort by date and limit number to 10
        posts.sort(key=lambda p: p.datetime, reverse=True)
        try:
            posts = posts[begin_at:begin_at+10]
        except IndexError: # possible errors: begin_at larger than num of posts / upper index out of bounds
            if begin_at >= len(posts):
                pass
            elif begin_at + 10 >= len(posts):
                posts = posts[begin_at:]

        #generate response
        serializer = serializers.PostSerializer(posts, many=True)
        return Response(serializer.data)