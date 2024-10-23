from rest_framework import views, status, generics
from rest_framework.response import Response
from .auth_views import verify_token, authorize
from .. import models, serializers
import jwt
import os
from django.db import IntegrityError
from django.db.models import Q

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

        #get friends IDs and usernames
        friends = []
        for f in user.friends.all():
            friends.append({
                'id': f.id,
                'username': f.username
            })
        
        response = {
            'userId': user_id,
            'username': user.username,
            'friends': friends
        } 

        return Response(response)
    
#send friend request
#POST /api/friendrequest
#with 'other_username' in body
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
        username = decoded_token['username']
        other_username = request.data.get('other_username', None)
        if not other_username:
            return Response({'error': 'Other username not provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        #check if usernames not the same
        if username == other_username:
            return Response({'error': 'Sender and receiver usernames must be different'}, status=status.HTTP_400_BAD_REQUEST)
        
        #get user objects
        user1 = models.User.objects.filter(username=username).first()
        user2 = models.User.objects.filter(username=other_username).first()
        if not user1:
            return Response({'error': 'Invalid sender username'}, status=status.HTTP_404_NOT_FOUND)
        if not user2:
            return Response({'error': 'Invalid receiver username'}, status=status.HTTP_404_NOT_FOUND)
        
        #check if already friends
        friend = user1.friends.filter(username=user2.username).first()
        if friend:
            return Response({'error': 'Users are already friends'}, status=status.HTTP_400_BAD_REQUEST)

        #create friend request
        fr = models.FriendRequest(from_user=user1, to_user=user2)
        #check if FR already exists
        try:
            fr.save()
        except IntegrityError:
            fr = None
            return Response({'error': 'Friend request already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = serializers.FriendRequestSerializer(fr)
        return Response(serializer.data)

#get list of friend request for the logged in user
#GET /api/user/<username>/friendrequests
class FriendRequestListView(generics.ListAPIView):
    serializer_class = serializers.FriendRequestSerializer
    def get(self, request, username):
        #authorize
        token = verify_token(request)
        try:
            decoded_token = authorize(token)
        except ValueError:
            return Response({'error': "Token not provided or invalid (must start with 'bearer ')"}, status=status.HTTP_401_UNAUTHORIZED)
        except (jwt.DecodeError, jwt.InvalidTokenError, jwt.InvalidSignatureError):
            return Response({'error': "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
        
        #get user
        token_username = decoded_token[1]
        if token_username != username:
            return Response({'error': "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
        user = models.User.objects.get(username=username)
        #get and return list of received FRs
        self.queryset = user.friend_requests_received.all()
        return self.list(request)
    
#accept friend request
#POST /api/friendrequests/accept
#provide 'fr_id' in body
class AcceptView(views.APIView):
    def post(self, request):
        #authorize
        token = verify_token(request)
        try:
            decoded_token = authorize(token)
        except ValueError:
            return Response({'error': "Token not provided or invalid (must start with 'bearer ')"}, status=status.HTTP_401_UNAUTHORIZED)
        except (jwt.DecodeError, jwt.InvalidTokenError, jwt.InvalidSignatureError):
            return Response({'error': "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
        
        #verify that FR exists
        fr_id = request.data.get('fr_id', None)
        #get user
        user_id = decoded_token['id']
        user = models.User.objects.get(id=user_id)
        fr = user.friend_requests_received.filter(id=fr_id).first()
        if not fr:
            return Response({'error': 'Invalid request ID or not provided'}, status=status.HTTP_404_NOT_FOUND)

        #add friend
        other_user = fr.from_user
        user.friends.add(other_user)
        fr.delete() #remove friend request from DB

        return Response(status=status.HTTP_200_OK)

class DeclineView(views.APIView):
    #what method?
    def delete(self, request):
        #authorize
        token = verify_token(request)
        try:
            decoded_token = authorize(token)
        except ValueError:
            return Response({'error': "Token not provided or invalid (must start with 'bearer ')"}, status=status.HTTP_401_UNAUTHORIZED)
        except (jwt.DecodeError, jwt.InvalidTokenError, jwt.InvalidSignatureError):
            return Response({'error': "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
        
        #get fr
        fr_id = request.data.get('fr_id', None)
        user = models.User.objects.get(id=decoded_token['id'])
        fr = user.friend_requests_received.filter(id=fr_id).first()
        if not fr:
            return Response({'error': 'Invalid request ID or not provided'}, status=status.HTTP_404_NOT_FOUND)
        
        #remove friend request
        fr.delete()
        return Response(status=status.HTTP_200_OK)
    
class CancelView(views.APIView):
    #what method?
    def delete(self, request):
        #authorize
        token = verify_token(request)
        try:
            decoded_token = authorize(token)
        except ValueError:
            return Response({'error': "Token not provided or invalid (must start with 'bearer ')"}, status=status.HTTP_401_UNAUTHORIZED)
        except (jwt.DecodeError, jwt.InvalidTokenError, jwt.InvalidSignatureError):
            return Response({'error': "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
        
        #get fr
        fr_id = request.data.get('fr_id', None)
        user = models.User.objects.get(id=decoded_token['id'])
        fr = user.friend_requests_sent.filter(id=fr_id).first()
        if not fr:
            return Response({'error': 'Invalid request ID or not provided'}, status=status.HTTP_404_NOT_FOUND)
        
        #remove friend request
        fr.delete()
        return Response(status=status.HTTP_200_OK)
    

#get friendship status between the logged in user and another user
#GET /api/friends/status?other_username=<username>
class FriendshipStatusView(views.APIView):
    def get(self, request):
        #authorization
        token = verify_token(request)
        try:
            decoded_token = authorize(token)
        except ValueError:
            return Response({'error': "Token not provided or invalid (must start with 'bearer ')"}, status=status.HTTP_401_UNAUTHORIZED)
        except (jwt.DecodeError, jwt.InvalidTokenError, jwt.InvalidSignatureError):
            return Response({'error': "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
        
        #check status: friends, request sent, request received, not friends
        username = decoded_token['username']
        other_username = request.query_params.get('other_username', None)
        if not other_username:
            return Response({'error': 'Other username not provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = models.User.objects.get(username=username)
        user2 = models.User.objects.filter(username=other_username).first()
        if not user2:
            return Response({'error': 'Other username invalid'}, status=status.HTTP_400_BAD_REQUEST)

        response = {
            'user': username,
            'otherUser': other_username, 
        }

        #check if friends
        if user.friends.filter(username=other_username).exists():
            response['status'] = 'friends'
        elif models.FriendRequest.objects.filter(Q(from_user=user), Q(to_user=user2)).exists():
            response['status'] = 'request sent'
        elif models.FriendRequest.objects.filter(Q(to_user=user), Q(from_user=user2)).exists():
            response['status'] = 'request received'
        else:
            response['status'] = 'not friends'

        return Response(response)