from django.test import TestCase
from rest_framework.test import APIClient
from ..models import User, FriendRequest

CLIENT = APIClient()

USERNAME = 'USER1'
EMAIL = 'user1@gmail.com'
PASSWORD = 'password1'
USER_TOKEN = ""
USERNAME_2 = 'USER2'
EMAIL_2 = 'user2@gmail.com'
PASSWORD_2 = 'password2'


class TestFriendshipSetup(TestCase):
    def setUp(self):
        global USER_TOKEN
        resp = CLIENT.post('/api/auth/register', {'username': USERNAME, 'password': PASSWORD, 'email': EMAIL})
        json = resp.json()
        if "error" not in json:
            USER_TOKEN = json['token']
            CLIENT.credentials(HTTP_AUTHORIZATION=f'Bearer {USER_TOKEN}')
        CLIENT.post('/api/auth/register', {'username': USERNAME_2, 'password': PASSWORD_2, 'email': EMAIL_2})

class TestGetFriends(TestFriendshipSetup):
    def test(self):
        user1 = User.objects.get(username=USERNAME)
        user2 = User.objects.get(username=USERNAME_2)
        user1.friends.add(user2)

        response = CLIENT.get('/api/friends/')
        self.assertEqual(response.status_code, 200)
        self.assertIn('friends', response.json())
        self.assertEqual(len(response.json()['friends']), 1)
        self.assertEqual(response.json()['friends'][0]['username'], USERNAME_2)

class TestSendFriendRequest(TestFriendshipSetup):
    def test(self):
        response = CLIENT.post('/api/friendrequest/', {'other_username': USERNAME_2})
        self.assertEqual(response.status_code, 200)
        self.assertIn('id', response.json())

class TestSendFriendRequestToSelf(TestFriendshipSetup):
    def test(self):
        response = CLIENT.post('/api/friendrequest/', {'other_username': USERNAME})
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())

class TestSendFriendRequestToNonexistentUser(TestFriendshipSetup):
    def test(self):
        response = CLIENT.post('/api/friendrequest/', {'other_username': 'NON_EXISTENT'})
        self.assertEqual(response.status_code, 404)
        self.assertIn('error', response.json())

class TestGetOwnFriendRequests(TestFriendshipSetup):
    def test(self):
        user1 = User.objects.get(username=USERNAME)
        user2 = User.objects.get(username=USERNAME_2)
        FriendRequest.objects.create(from_user=user2, to_user=user1)

        response = CLIENT.get(f'/api/user/{USERNAME}/friendrequests')
        self.assertEqual(response.status_code, 200)
        self.assertIn('results', response.json())
        self.assertEqual(len(response.json()['results']), 1)

class TestAcceptFriendRequest(TestFriendshipSetup):
    def test(self):
        user1 = User.objects.get(username=USERNAME)
        user2 = User.objects.get(username=USERNAME_2)
        friend_request = FriendRequest.objects.create(from_user=user2, to_user=user1)
        response = CLIENT.post('/api/friendrequests/accept/', {'fr_id': friend_request.id})
        self.assertEqual(response.status_code, 200)

        self.assertIn(user2, user1.friends.all())


class TestDeclineFriendRequest(TestFriendshipSetup):
    def test(self):
        user1 = User.objects.get(username=USERNAME)
        user2 = User.objects.get(username=USERNAME_2)
        friend_request = FriendRequest.objects.create(from_user=user2, to_user=user1)
        response = CLIENT.delete('/api/friendrequests/decline/', {'fr_id': friend_request.id})
        self.assertEqual(response.status_code, 200)
        self.assertFalse(FriendRequest.objects.filter(id=friend_request.id).exists())


class TestCancelFriendRequest(TestFriendshipSetup):
    def test(self):
        user1 = User.objects.get(username=USERNAME)
        user2 = User.objects.get(username=USERNAME_2)
        friend_request = FriendRequest.objects.create(from_user=user1, to_user=user2)
        response = CLIENT.delete('/api/friendrequests/cancel/', {'fr_id': friend_request.id})
        self.assertEqual(response.status_code, 200)
        self.assertFalse(FriendRequest.objects.filter(id=friend_request.id).exists())

class TestFriendshipStatusFriends(TestFriendshipSetup):
    def test(self):
        user1 = User.objects.get(username=USERNAME)
        user2 = User.objects.get(username=USERNAME_2)
        user1.friends.add(user2)

        response = CLIENT.get('/api/friends/status/', {'other_username': USERNAME_2})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], 'friends')

class TestFriendshipStatusRequestSent(TestFriendshipSetup):
    def test(self):
        user1 = User.objects.get(username=USERNAME)
        user2 = User.objects.get(username=USERNAME_2)
        FriendRequest.objects.create(from_user=user1, to_user=user2)
        response = CLIENT.get('/api/friends/status/', {'other_username': USERNAME_2})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], 'request sent')

class TestFriendshipStatusRequestReceived(TestFriendshipSetup):
    def test(self):
        user1 = User.objects.get(username=USERNAME)
        user2 = User.objects.get(username=USERNAME_2)
        FriendRequest.objects.create(from_user=user2, to_user=user1)
        response = CLIENT.get('/api/friends/status/', {'other_username': USERNAME_2})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], 'request received')

class TestFriendshipStatusNotFriends(TestFriendshipSetup):
    def test(self):
        response = CLIENT.get('/api/friends/status/', {'other_username': 'NON_EXISTENT'})
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())
