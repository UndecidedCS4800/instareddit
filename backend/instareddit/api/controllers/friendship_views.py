from rest_framework import views, status
from rest_framework.response import Response
from .auth_views import verify_token
from .. import models, serializers
import jwt
import os
from django.db import IntegrityError

#GET /api/friends
#is used by 'chat' to get a list of friend ID's for the logged in user
class FriendsIdsGetView(views.APIView):
    def get(self, request):
        #verify token
        token = verify_token(request)
        if not token:
            return Response({'error': "Token not provided or invalid (must start with 'bearer ')"}, status=status.HTTP_401_UNAUTHORIZED)
        #get user id from token
        try:
            decoded_token = jwt.decode(token, os.environ.get('TOKEN_KEY'), algorithms=['HS256'])
        except (jwt.DecodeError, jwt.InvalidTokenError, jwt.InvalidSignatureError):
            return Response({'error': "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
        
        user_id = decoded_token['id']
        user = models.User.objects.filter(id=user_id).first()
        if not user:
            return Response({'error': 'Invalid user ID'}, status=status.HTTP_400_BAD_REQUEST)

        #get and return friends IDs
        friends_ids = []
        for f in user.friends.all():
            friends_ids.append(f.id)

        response = {
            'userId': user_id,
            'username': user.username,
            'friendsIds': friends_ids
        } 

        return Response(response)
    
#send friend request
class FriendRequestCreateView(views.APIView):
    def post(self, request):
        #authorize
        token = verify_token(request)
        if not token:
            return Response({'error': "Token not provided or invalid (must start with 'bearer ')"}, status=status.HTTP_401_UNAUTHORIZED)
        #get user id from token
        try:
            decoded_token = jwt.decode(token, os.environ.get('TOKEN_KEY'), algorithms=['HS256'])
        except (jwt.DecodeError, jwt.InvalidTokenError, jwt.InvalidSignatureError):
            return Response({'error': "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
        
        #get both user ids
        user_id = decoded_token['id']
        other_id = request.data.get('other_id', None)
        if not other_id:
            return Response({'error': 'Other user ID not provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        #get user objects
        user1 = models.User.objects.filter(id=user_id).first()
        user2 = models.User.objects.filter(id=other_id).first()
        if not user1:
            return Response({'error': 'Invalid sender ID'}, status=status.HTTP_400_BAD_REQUEST)
        if not user2:
            return Response({'error': 'Invalid receiver ID'}, status=status.HTTP_400_BAD_REQUEST)

        #create friend request
        fr = models.FriendRequest(from_user=user1, to_user=user2)
        try:
            fr.save()
        except IntegrityError:
            fr = None
            return Response({'error': 'Friend request already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = serializers.FriendRequestSerializer(fr)
        return Response(serializer.data)
    
"""
TODO
- get all received FR's
- get friendship status (friends/request sent/request received/not friends)
- accept/decline friend request
- cancel friend request
"""