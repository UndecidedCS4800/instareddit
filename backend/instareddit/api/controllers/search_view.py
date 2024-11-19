from rest_framework import views, status
from rest_framework.response import Response
from .. import models
from django.db.models import Q
from .. import serializers

class SearchView(views.APIView):
    def get(self, request):
        #get query
        query = str(request.query_params.get('query', None))
        #return nothing if empty query
        if not query:
            return Response(status=status.HTTP_200_OK)

        #get results
        query_results = {}

        # FIX NOT FINDING OBJECTS? DB NOT FILLED?
        users = models.User.objects.filter(Q(username__istartswith=query))
        communities = models.Community.objects.filter(Q(name__istartswith=query))

        users_s = serializers.UserSearchSerailizer(users, many=True)
        communities_s = serializers.CommunitySearchSerializer(communities, many=True)
        query_results['users'] = users_s.data
        query_results['communities'] = communities_s.data

        return Response(query_results)

