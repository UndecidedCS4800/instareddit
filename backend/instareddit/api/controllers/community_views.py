from rest_framework import views, status, generics, mixins
from rest_framework.response import Response
from .. import serializers, models, pagination_classes
from django.db.models import Q
from .. import forms
from .auth_views import requires_token

#GET /api/communities
#optional query param: 'query' (search by name)
#POST /api/communities - create new community
class CommunityListCreateView(generics.ListCreateAPIView):
    serializer_class = serializers.CommunitySerializer
    pagination_class = pagination_classes.StandardPostSetPagination

    def get(self, request, *args, **kwargs):
        #query query param
        name_query = request.query_params.get('query', None)
        communities = models.Community.objects.all()
        if name_query:
            communities = communities.filter(Q(name__icontains=name_query))
        communities = sorted(list(communities), key=lambda c: c.num_members, reverse=True)
        self.queryset = communities
        return self.list(request)
    
    def post(self, request, *args, **kwargs):
        """
        Expects body: name, description, picture(optional), owner (username)
        """
        form = forms.CommunityCreateForm(request.data)
        if not form.is_valid():
            return Response({'error': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)
        data = form.cleaned_data
        
        owner = models.User.objects.get(username=data.get('owner'))
        community = models.Community.objects.create(
            name = data.get('name'),
            description = data.get('description'),
            picture = data.get('picture', None),
            owner = owner
        )
        community.admins.add(owner)
        community.members.add(owner)
        community.save()

        serializer = serializers.CommunitySerializer(community)
        return Response(serializer.data, status=status.HTTP_200_OK)

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
    
    #for admins - edit community details
    # PATCH /api/community/<pk>/about
    # with body {name, description}
    @requires_token
    def patch(self, request, pk, **kwargs):
        decoded_token = kwargs['token']

        data = request.data
        if not ('name' in request.data or 'description' in request.data):
            return Response({'error': 'Data not provided'})
        
        #update community
        community = models.Community.objects.filter(id=pk).first()
        if not community:
            return Response({'error': "Invalid Community ID"}, status=status.HTTP_400_BAD_REQUEST)
        
        name = data.get('name', None)
        community.name = name if name else community.name
        description = data.get('description', None)
        community.description = description if description else community.description
        community.save()

        return Response(serializers.CommunitySerializer(community).data, status=status.HTTP_200_OK)

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
    
    #delete post withing a community
    # DELETE /api/community/<community_id>/post/<post_id>
    @requires_token
    def delete(self, request, community_pk, post_pk, **kwargs):
        decoded_token = kwargs['token']

        #check if community id valid
        community = models.Community.objects.filter(id=community_pk).first()
        if not community:
            return Response({'error': 'Invalid Community ID'}, status=status.HTTP_400_BAD_REQUEST)
        
        #check if authorized
        username = decoded_token['username']
        user = models.User.objects.get(username=username)
        if not community.admins.contains(user):
            return Response({'error': 'Not authorized'}, status=status.HTTP_401_UNAUTHORIZED)

        #check if post id valid
        post = community.post_set.filter(id=post_pk).first()
        if not post: 
            return Response({'error': 'Invalid Post ID'}, status=status.HTTP_400_BAD_REQUEST)
        
        #delete post
        post.delete()
        return Response(status=status.HTTP_200_OK)

    
#adding/removing admins
class CommunityAdminCreateDestroyView(views.APIView):
    @requires_token
    def post(self, request, pk,**kwargs):
        decoded_token = kwargs['token']

        #add admin
        #POST community/<pk>/admin
        #with body { username: <username> }
        community = models.Community.objects.filter(id=pk).first()
        if not community:
            return Response({'error': 'Invalid community ID'}, status=status.HTTP_400_BAD_REQUEST)
        #chekc if user authorzied
        admin = models.User.objects.get(username=decoded_token['username'])
        if not community.admins.contains(admin):
            return Response({'error': 'Not authorized'}, status=status.HTTP_401_UNAUTHORIZED)

        username = request.data.get('username', None)
        if not username:
            return Response({'error': 'Username not provided'}, status=status.HTTP_400_BAD_REQUEST)
        user = models.User.objects.filter(username=username).first()
        if not user:
            return Response({'error': 'Username invalid'}, status=status.HTTP_400_BAD_REQUEST)
        a = community.admins.filter(username=username).first()
        if a:
            return Response({'error': 'User already an admin'}, status=status.HTTP_400_BAD_REQUEST)
        
        community.admins.add(user)
        return Response(status=status.HTTP_200_OK)
    
    @requires_token
    def delete(self, request, pk, **kwargs):
        decoded_token = kwargs['token']

        #delete an admin
        #DELETE community/<pk>/admin
        #with body { username: <username> }

        community = models.Community.objects.filter(id=pk).first()
        if not community:
            return Response({'error': 'Invalid community ID'}, status=status.HTTP_400_BAD_REQUEST)
        #chekc if user authorzied
        admin = models.User.objects.get(username=decoded_token['username'])
        if not community.admins.contains(admin):
            return Response({'error': 'Not authorized'}, status=status.HTTP_401_UNAUTHORIZED)
        
        username = request.data.get('username', None)
        if not username:
            return Response({'error': 'Username not provided'}, status=status.HTTP_400_BAD_REQUEST)
        user = models.User.objects.filter(username=username).first()
        if not user:
            return Response({'error': 'Username invalid'}, status=status.HTTP_400_BAD_REQUEST)
        a = community.admins.filter(username=username).first()
        if not a:
            return Response({'error': 'User not an admin'}, status=status.HTTP_400_BAD_REQUEST)
        
        community.admins.remove(user)
        return Response(status=status.HTTP_200_OK)