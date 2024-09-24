from rest_framework import views, status
from rest_framework.response import Response
from .. import serializers, models

# get all posts from a community - GET /api/community/<pk>
class CommunityPostsView(views.APIView):
    def get(self, request, pk):
        community = models.Community.objects.filter(id=pk)
        if not community.exists():
            return Response("Invalid Community ID", status=status.HTTP_400_BAD_REQUEST)
        posts = community[0].post_set.all()
        serializer = serializers.PostSerializer(posts, many=True)
        return Response(serializer.data)
    
# get details about a community - GET /api/community/<pk>/about
class CommunityDetailView(views.APIView):
    def get(self, request, pk):
        community = models.Community.objects.filter(id=pk)
        if not community.exists():
            return Response("Invalid Community ID", status=status.HTTP_400_BAD_REQUEST)
        serializer = serializers.CommunitySerializer(community[0])
        return Response(serializer.data)

#get community post with its comments - GET /api/community/<community_pk>/post/<post_pk>
class CommunityPostDetailView(views.APIView):
    def get(self, request, community_pk, post_pk):
        #get community
        community = models.Community.objects.filter(id=community_pk)
        if not community.exists():
            return Response("Invalid Community ID", status=status.HTTP_400_BAD_REQUEST)
        #get post from the community's post set
        post = community[0].post_set.filter(id=post_pk)
        if not post.exists():
            return Response("Invalid Post ID", status=status.HTTP_400_BAD_REQUEST)
        #get comments on posts
        comments = post[0].comment_set.all()
        #convert data to JSON
        post_serializer = serializers.PostSerializer(post[0])
        comment_serializer = serializers.CommentSerializer(comments, many=True)
        #create response
        response = {}
        response.update(post_serializer.data)
        response['comments'] = comment_serializer.data
        return Response(response)