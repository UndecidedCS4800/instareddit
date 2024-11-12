from django.test import TestCase
from rest_framework.test import APIClient
from ..models import Community, User, Post
from ..serializers import CommunitySerializer, PostSerializer
from datetime import datetime

CLIENT = APIClient()

COMMUNITY_ID = 1
POST_ID = 1

USER_ID = 1
USERNAME = 'USER1'
EMAIL = 'user1@gmail.com'
PASSWORD = '12345678'
PASSWORD_HASH = '$2b$12$09H17WQZl5bZ6jjF4A60.ehJ0ZW2Gms/0Fbpc/AwkUbM6QjmtYNqi'


class SetUpTest(TestCase):
    def setUp(self):
        # create user
        u = User.objects.create(
            id=USER_ID, username=USERNAME, email=EMAIL, password_hash=PASSWORD_HASH)
        # create test community
        c = Community.objects.create(
            id=COMMUNITY_ID, name='TEST COMMUNITY', description='TEST COMMUNITY DESCRIPTION', owner=u)
        # create test post
        Post.objects.create(id=POST_ID, user=u, text='TEST POST',
                            datetime=datetime.now(), community=c)
        # simualte login
        response = CLIENT.post(
            '/api/auth/login', {'username': USERNAME, 'password': PASSWORD})
        token = response.json()['token']
        self.HEADERS = {'Authorization': f'bearer {token}'}

    def check_post(self, p):
        return (
            'id' in p,
            'user' in p,
            'username' in p,
            'text' in p,
            'image' in p,
            'datetime' in p,
            'community' in p,
            'community_name' in p,
        )

# TODO ADD RECENTPOSTSVIEW TEST


class UserPostsTestValid(SetUpTest):
    def test(self):
        response = CLIENT.get(f'/api/user/{USERNAME}/posts', headers=self.HEADERS)
        self.assertEqual(response.status_code, 200)
        self.assertTrue('count' in response.json())
        self.assertTrue('next' in response.json())
        self.assertTrue('previous' in response.json())
        self.assertTrue('results' in response.json())
        p = response.json()['results'][0] if len(response.json()['results']) > 0 else None
        if p:
            self.assertTrue(self.check_post(p))

class UserPostsTestInvalid(SetUpTest):
    def test(self):
        response = CLIENT.get(f'/api/user/OTHERUSER/posts', headers=self.HEADERS)
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())
