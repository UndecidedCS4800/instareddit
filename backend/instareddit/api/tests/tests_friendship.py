from django.test import TestCase
from rest_framework.test import APIClient
from ..models import  User, FriendRequest
from .. import models


CLIENT = APIClient()

FRIEND_REQUEST_ID = 1
FRIEND_REQUEST_ID_2 = 2

USER_ID = 1
USERNAME = 'USER1'
EMAIL = 'user1@gmail.com'

USER_ID_2 = 2
USERNAME_2 = 'USER2'
EMAIL_2 = 'user2@gmail.com'

USER_ID_3 = 3
USERNAME_3 = 'USER3'
EMAIL_3 = 'user3@gmail.com'

USER_ID_4 = 4
USERNAME_4 = 'USER4'
EMAIL_4 = 'user4@gmail.com'

USER_ID_5 = 5
USERNAME_5 = 'USER5'
EMAIL_5 = 'user5@gmail.com'

USER_ID_6 = 6
USERNAME_6 = 'USER6'
EMAIL_6 = 'user6@gmail.com'

PASSWORD = '12345678'
PASSWORD_HASH = '$2b$12$09H17WQZl5bZ6jjF4A60.ehJ0ZW2Gms/0Fbpc/AwkUbM6QjmtYNqi'
TOKEN = ''

class SetUpTest(TestCase):
    def setUp(self):
        #create users
        global u
        u = User.objects.create(id=USER_ID, username=USERNAME, email=EMAIL, password_hash=PASSWORD_HASH)
        u2 = User.objects.create(id=USER_ID_2, username=USERNAME_2, email=EMAIL_2, password_hash=PASSWORD_HASH)
        u3 = User.objects.create(id=USER_ID_3, username=USERNAME_3, email=EMAIL_3, password_hash=PASSWORD_HASH)
        u4 = User.objects.create(id=USER_ID_4, username=USERNAME_4, email=EMAIL_4, password_hash=PASSWORD_HASH)
        u5 = User.objects.create(id=USER_ID_5, username=USERNAME_5, email=EMAIL_5, password_hash=PASSWORD_HASH)
        u6 = User.objects.create(id=USER_ID_6, username=USERNAME_6, email=EMAIL_6, password_hash=PASSWORD_HASH)

        #create frienships
        u.friends.add(u2)
        u.friends.add(u3)

        #create friendrequest
        fr1= models.FriendRequest(id =FRIEND_REQUEST_ID, from_user=u, to_user=u4)
        fr1.save()

        fr2= models.FriendRequest(id =FRIEND_REQUEST_ID_2, from_user=u5, to_user=u)
        fr2.save()


        response = CLIENT.post('/api/auth/login',
			    {'username': USERNAME, 'password': PASSWORD})
        global TOKEN
        TOKEN = response.json()['token']

class FriendshipGetTestInvalidToken(SetUpTest):
    def test(self):
        response = CLIENT.get('/api/friends/',
			  headers={'Authorization': f'bearer invalid'})
        self.assertEqual(response.status_code, 401)
        self.assertTrue('error' in response.json())

class FriendshipGetTest(SetUpTest):
    def test(self):
        response = CLIENT.get('/api/friends/',
			  headers={'Authorization': f'bearer {TOKEN}'})
        self.assertEqual(response.status_code, 200)
        self.assertTrue('error' not in response.json())

        #two friends
        friends = response.json()['friends']
        self.assertEqual(len(friends), 2)

class FriendshipDeleteTestInvalidToken(SetUpTest):
    def test(self):
        response = CLIENT.delete('/api/friends/',
			  headers={'Authorization': f'bearer invalid'})
        self.assertEqual(response.status_code, 401)
        self.assertTrue('error' in response.json())

class FriendshipDeleteTest(SetUpTest):
    def test(self):
        response = CLIENT.delete('/api/friends/',
			  headers={'Authorization': f'bearer {TOKEN}'},
              data = {'username' : f'{USERNAME_2}'})
        self.assertEqual(response.status_code, 200)
        
        friends=[]
        for f in u.friends.all():
            friends.append({
                'id' : f.id
            })
        self.assertEqual(len(friends), 1)

class FriendshipPostFriendRequestInvalidToken(SetUpTest):
    def test(self):
        response = CLIENT.post('/api/friendrequests/',
			  headers={'Authorization': f'bearer invalid'})
        self.assertEqual(response.status_code, 401)
        self.assertTrue('error' in response.json())

class FriendshipPostFriendRequestNoUsername(SetUpTest):
    def test(self):
        response = CLIENT.post('/api/friendrequests/',
			  headers={'Authorization': f'bearer {TOKEN}'},
              data = {'other_username' : ''})
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

class FriendshipPostFriendRequestSameUsername(SetUpTest):
    def test(self):
        response = CLIENT.post('/api/friendrequests/',
			  headers={'Authorization': f'bearer {TOKEN}'},
              data = {'other_username': f'{USERNAME}'})
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

class FriendshipPostFriendRequestInvalidUsername(SetUpTest):
    def test(self):
        response = CLIENT.post('/api/friendrequests/',
			  headers={'Authorization': f'bearer {TOKEN}'},
              data = {'other_username': 'invalid'})
        self.assertEqual(response.status_code, 404)
        self.assertTrue('error' in response.json())

class FriendshipPostFriendRequestAlreadyFriends(SetUpTest):
    def test(self):
        response = CLIENT.post('/api/friendrequests/',
			  headers={'Authorization': f'bearer {TOKEN}'},
              data = {'other_username': f'{USERNAME_2}'})
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

class FriendshipPostFriendRequestFriendRequestExists(SetUpTest):
    def test(self):
        response = CLIENT.post('/api/friendrequests/',
			  headers={'Authorization': f'bearer {TOKEN}'},
              data = {'other_username': f'{USERNAME}'})
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

class FriendshipPostFriendRequest(SetUpTest):
    def test(self):
        response = CLIENT.post('/api/friendrequests/',
			  headers={'Authorization': f'bearer {TOKEN}'},
              data = {'other_username': f'{USERNAME_5}'})
        self.assertEqual(response.status_code, 200)
        self.assertTrue('error' not in response.json())

class FriendshipGetFriendRequestInvalidToken(SetUpTest):
    def test(self):
        response = CLIENT.get(f'/api/user/{USERNAME}/friendrequests',
                              headers ={'Authorization' : f'bearer invalid'})
        self.assertEqual(response.status_code, 401)
        self.assertTrue('error' in response.json())

class FriendshipGetFriendRequestUnauthorized(SetUpTest):
    def test(self):
        response = CLIENT.get(f'/api/user/{USERNAME_2}/friendrequests',
                              headers ={'Authorization' : f'bearer {TOKEN}'})
        self.assertEqual(response.status_code, 401)
        self.assertTrue('error' in response.json())

class FriendshipPostAcceptInvalidToken(SetUpTest):
    def test(self):
        response = CLIENT.post(f'/api/friendrequests/accept/',
                              headers ={'Authorization' : f'bearer invalid'},
                              data= {'fr_id' : FRIEND_REQUEST_ID_2})
        self.assertEqual(response.status_code, 401)
        self.assertTrue('error' in response.json())

class FriendshipPostAcceptInvalidFriendRequest(SetUpTest):
    def test(self):
        response = CLIENT.post(f'/api/friendrequests/accept/',
                              headers ={'Authorization' : f'bearer {TOKEN}'},
                              data= {'fr_id' : 3})
        self.assertEqual(response.status_code, 404)
        self.assertTrue('error' in response.json())


class FriendshipPostAcceptFriendRequest(SetUpTest):
    def test(self):
        response = CLIENT.post(f'/api/friendrequests/accept/',
                              headers ={'Authorization' : f'bearer {TOKEN}'},
                              data= {'fr_id' : FRIEND_REQUEST_ID_2})
        self.assertEqual(response.status_code, 200)

class FriendshipPostDeclineInvalidToken(SetUpTest):
    def test(self):
        response = CLIENT.delete(f'/api/friendrequests/decline/',
                              headers ={'Authorization' : f'bearer invalid'},
                              data= {'fr_id' : FRIEND_REQUEST_ID_2})
        self.assertEqual(response.status_code, 401)
        self.assertTrue('error' in response.json())

class FriendshipPostDeclineInvalidFriendRequest(SetUpTest):
    def test(self):
        response = CLIENT.delete(f'/api/friendrequests/decline/',
                              headers ={'Authorization' : f'bearer {TOKEN}'},
                              data= {'fr_id' : 3})
        self.assertEqual(response.status_code, 404)
        self.assertTrue('error' in response.json())


class FriendshipPostDeclineFriendRequest(SetUpTest):
    def test(self):
        response = CLIENT.delete(f'/api/friendrequests/decline/',
                              headers ={'Authorization' : f'bearer {TOKEN}'},
                              data= {'fr_id' : FRIEND_REQUEST_ID_2})
        self.assertEqual(response.status_code, 200)

class FriendshipPostCancelInvalidToken(SetUpTest):
    def test(self):
        response = CLIENT.delete(f'/api/friendrequests/cancel/',
                              headers ={'Authorization' : f'bearer invalid'},
                              data= {'fr_id' : FRIEND_REQUEST_ID})
        self.assertEqual(response.status_code, 401)
        self.assertTrue('error' in response.json())

class FriendshipPostCancelInvalidFriendRequest(SetUpTest):
    def test(self):
        response = CLIENT.delete(f'/api/friendrequests/cancel/',
                              headers ={'Authorization' : f'bearer {TOKEN}'},
                              data= {'fr_id' : 3})
        self.assertEqual(response.status_code, 404)
        self.assertTrue('error' in response.json())


class FriendshipPostCancelFriendRequest(SetUpTest):
    def test(self):
        response = CLIENT.delete(f'/api/friendrequests/cancel/',
                              headers ={'Authorization' : f'bearer {TOKEN}'},
                              data= {'fr_id' : FRIEND_REQUEST_ID})
        self.assertEqual(response.status_code, 200)

class FriendshipStatusInvalidToken(SetUpTest):
    def test(self):
        response = CLIENT.get(f'/api/friends/status/?other_username={USERNAME_2}',
                              headers ={'Authorization' : f'bearer invalid'})
        self.assertEqual(response.status_code, 401)
        self.assertTrue('error' in response.json())

class FriendshipStatusNoUsername(SetUpTest):
    def test(self):
        response = CLIENT.get(f'/api/friends/status/?other_username=',
                              headers ={'Authorization' : f'bearer {TOKEN}'})
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

class FriendshipStatusInvalidUsername(SetUpTest):
    def test(self):
        response = CLIENT.get(f'/api/friends/status/?other_username=invalid',
                              headers ={'Authorization' : f'bearer {TOKEN}'})
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

class FriendshipStatusFriends(SetUpTest):
    def test(self):
        response = CLIENT.get(f'/api/friends/status/?other_username={USERNAME_2}',
                              headers ={'Authorization' : f'bearer {TOKEN}'})
        response_data = response.json()
        self.assertEqual(response_data['status'], 'friends')
        self.assertEqual(response.status_code, 200)
        self.assertTrue('error' not in response.json())

class FriendshipStatusRequestSent(SetUpTest):
    def test(self):
        response = CLIENT.get(f'/api/friends/status/?other_username={USERNAME_4}',
                              headers ={'Authorization' : f'bearer {TOKEN}'})
        response_data = response.json()
        self.assertEqual(response_data['status'], 'request sent')
        self.assertEqual(response.status_code, 200)
        self.assertTrue('error' not in response.json())

class FriendshipStatusRequestReceived(SetUpTest):
    def test(self):
        response = CLIENT.get(f'/api/friends/status/?other_username={USERNAME_5}',
                              headers ={'Authorization' : f'bearer {TOKEN}'})
        response_data = response.json()
        self.assertEqual(response_data['status'], 'request received')
        self.assertEqual(response.status_code, 200)
        self.assertTrue('error' not in response.json())

class FriendshipStatusNotFriends(SetUpTest):
    def test(self):
        response = CLIENT.get(f'/api/friends/status/?other_username={USERNAME_6}',
                              headers ={'Authorization' : f'bearer {TOKEN}'})
        response_data = response.json()
        self.assertEqual(response_data['status'], 'not friends')
        self.assertEqual(response.status_code, 200)
        self.assertTrue('error' not in response.json())


        
#python3 manage.py test api.tests.tests_friendship
        

