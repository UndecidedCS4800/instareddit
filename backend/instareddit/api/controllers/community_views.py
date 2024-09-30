from rest_framework import views, status, generics, mixins
from rest_framework.response import Response
from .. import serializers, models, pagination_classes

# get all posts from a community - GET /api/community/<pk>
class CommunityPostsView(generics.GenericAPIView, mixins.ListModelMixin):
    serializer_class = serializers.PostSerializer
    pagination_class = pagination_classes.StandardPostSetPagination

    def get(self, request, pk):
        community = models.Community.objects.filter(id=pk)
        if not community.exists():
            return Response({'error': "Invalid Community ID"}, status=status.HTTP_400_BAD_REQUEST)
        self.queryset = community[0].post_set.all()
        return self.list(request)
    
# get details about a community - GET /api/community/<pk>/about
class CommunityDetailView(views.APIView):
    def get(self, request, pk):
        community = models.Community.objects.filter(id=pk)
        if not community.exists():
            return Response({'error': "Invalid Community ID"}, status=status.HTTP_400_BAD_REQUEST)
        serializer = serializers.CommunitySerializer(community[0])
        return Response(serializer.data)

#get community post with its comments - GET /api/community/<community_pk>/post/<post_pk>
class CommunityPostDetailView(views.APIView):
    def get(self, request, community_pk, post_pk):
        #get community
        community = models.Community.objects.filter(id=community_pk)
        if not community.exists():
            return Response({'error': "Invalid Community ID"}, status=status.HTTP_400_BAD_REQUEST)
        #get post from the community's post set
        post = community[0].post_set.filter(id=post_pk)
        if not post.exists():
            return Response({'error': "Invalid Post ID"}, status=status.HTTP_400_BAD_REQUEST)
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