from django.test import TestCase
from rest_framework.test import APIClient
from ..models import User, FriendRequest

CLIENT = APIClient()

# Predefined users
USERNAME = 'USER1'
EMAIL = 'user1@gmail.com'
PASSWORD = '12345678'
PASSWORD_HASH = '$2b$12$09H17WQZl5bZ6jjF4A60.ehJ0ZW2Gms/0Fbpc/AwkUbM6QjmtYNqi'
USER_INFO = {
    "first_name": "Sample",
    "last_name": "Sample",
    "date_of_birth": "1972/09/21",
    "profile_picture": None
}
USER_TOKEN = ""

OTHER_USER = 'USER2'
OTHER_EMAIL = 'user2@gmail.com'
OTHER_PASSWORD = '12345678'
OTHER_PASSWORD_HASH = '$2b$12$09H17WQZl5bZ6jjF4A60.ehJ0ZW2Gms/0Fbpc/AwkUbM6QjmtYNqi'

# Setup class for user registration and token generation
class TestUserSetup(TestCase):
    def setUp(self):
        global USER_TOKEN
        resp = CLIENT.post("/api/auth/register", {"username": USERNAME, "password": PASSWORD, "email": EMAIL})
        json = resp.json()
        if "error" not in json:
            USER_TOKEN = json['token']
            CLIENT.credentials(HTTP_AUTHORIZATION=f"Bearer {USER_TOKEN}")
        
        # Create other user (USER2)
        CLIENT.credentials()  # Reset the credentials
        resp_other = CLIENT.post("/api/auth/register", {"username": OTHER_USER, "password": OTHER_PASSWORD, "email": OTHER_EMAIL})
        json_other = resp_other.json()
        if "error" not in json_other:
            self.other_user_token = json_other['token']

# Friendship Tests
class TestFriendshipSetup(TestUserSetup):

    def test_invalid_userID(self):
        temp = APIClient()
        resp = temp.get("/api/friends")
        json = resp.json()
        self.assertEqual(resp.statusCode, 404)
        self.assertTrue("error" in json)
    
    def test_get_friend_ids(self):
        # Get the friend IDs and usernames for the logged-in user (USER1)
        resp = CLIENT.get("/api/user/USER1/friendrequests")
        self.assertTrue("error" not in resp.json())
        self.assertEqual(resp.statusCode, 200)

        
    def test_send_friend_request(self):
        # Send friend request from USER1 to USER2
        CLIENT.credentials(HTTP_AUTHORIZATION=f"Bearer {self.other_user_token}")
        resp = CLIENT.post("/api/friendrequest/", {"other_username": USERNAME})
        self.assertEqual(resp.status_code, 200)
        self.assertTrue('id' in resp.json())
        
    def test_send_friend_request_same_user(self):
        # Send friend request to the same user (should fail)
        resp = CLIENT.post("/api/friendrequest/", {"other_username": USERNAME})
        self.assertEqual(resp.status_code, 401)
        self.assertTrue("error" in resp.json())
        
    def test_send_friend_request_already_sent(self):
        # Send a friend request from USER1 to USER2 again (should fail as already exists)
        CLIENT.credentials(HTTP_AUTHORIZATION=f"Bearer {USER_TOKEN}")
        resp = CLIENT.post("/api/friendrequest/", {"other_username": OTHER_USER})
        self.assertEqual(resp.status_code, 401)
        self.assertTrue("error" in resp.json())
        
    def test_get_friend_requests(self):
        # Get the friend requests for the logged-in user (USER2)
        CLIENT.credentials(HTTP_AUTHORIZATION=f"Bearer {self.other_user_token}")
        resp = CLIENT.get("/api/user/USER2/friendrequests")
        self.assertEqual(resp.status_code, 200)
        self.assertTrue(isinstance(resp.json(), list))
        
    def test_accept_friend_request(self):
        # Accept a pending friend request
        friend_request = FriendRequest.objects.get(from_user__username=USERNAME, to_user__username=OTHER_USER)
        resp = CLIENT.post(f"/api/friendrequests/accept/", {"fr_id": friend_request.id})
        self.assertEqual(resp.status_code, 200)
        self.assertTrue("friends" in resp.json())
        
    def test_decline_friend_request(self):
        # Decline a pending friend request
        friend_request = FriendRequest.objects.get(from_user__username=USERNAME, to_user__username=OTHER_USER)
        resp = CLIENT.post(f"/api/friendrequests/decline/", {"fr_id": friend_request.id})
        self.assertEqual(resp.status_code, 200)
        self.assertTrue("message" in resp.json())

    def test_cancel_friend_request(self):
        # Cancel a pending friend request
        friend_request = FriendRequest.objects.get(from_user__username=USERNAME, to_user__username=OTHER_USER)
        resp = CLIENT.post(f"/api/friendrequests/cancel/", {"fr_id": friend_request.id})
        self.assertEqual(resp.status_code, 200)
        self.assertTrue("message" in resp.json())

    def test_friendship_status(self):
        # Check if two users are friends
        resp = CLIENT.get(f"/api/friends/status/?other_username={OTHER_USER}")
        json = resp.json()
        self.assertEqual(resp.status_code, 200)
        self.assertTrue("status" in json)
        
    def test_no_friendship_status(self):
        # Check friendship status for users who are not friends
        resp = CLIENT.get(f"/api/friends/status/?other_username={OTHER_USER}")
        json = resp.json()
        self.assertEqual(resp.status_code, 401)
        self.assertEqual(json['status'], 'not friends')
