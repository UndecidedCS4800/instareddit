from rest_framework import generics, views, status
from rest_framework.response import Response
from .. import serializers, models, forms

# get all posts from a community - GET /api/community/<pk>
class CommunityPostsView(views.APIView):
    def get(self, request, pk):
        community = models.Community.objects.filter(id=pk)
        if not community.exists():
            return Response("Community with this ID does not exist", status=status.HTTP_400_BAD_REQUEST)
        posts = community[0].post_set.all()
        serializer = serializers.PostSerializer(posts, many=True)
        return Response(serializer.data)
    
# get details about a community - GET /api/community/<pk>/about
class CommunityDetailView(views.APIView):
    def get(self, request, pk):
        community = models.Community.objects.filter(id=pk)
        if not community.exists():
            return Response("Community with this ID does not exist", status=status.HTTP_400_BAD_REQUEST)
        serializer = serializers.CommunitySerializer(community[0])
        return Response(serializer.data)