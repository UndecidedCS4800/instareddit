from rest_framework import views, status
from rest_framework.response import Response
from .auth_views import verify_token
from .. import models
import jwt
import os

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