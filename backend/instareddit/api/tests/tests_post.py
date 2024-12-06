from django.test import TestCase
from rest_framework.test import APIClient
from ..models import Community, User, Post
from ..serializers import CommunitySerializer, PostSerializer
from datetime import datetime

CLIENT = APIClient()

COMMUNITY_ID = 1
POST_ID = 1
POST_ID_2 = 2
POST_ID_3 = 3

USER_ID = 1
USERNAME = 'USER1'
EMAIL = 'user1@gmail.com'

USER_ID_2 = 2
USERNAME_2 = 'USER2'
EMAIL_2 = 'user2@gmail.com'

USER_ID_3 = 3
USERNAME_3 = 'USER3'
EMAIL_3 = 'user3@gmail.com'

PASSWORD = '12345678'
PASSWORD_HASH = '$2b$12$09H17WQZl5bZ6jjF4A60.ehJ0ZW2Gms/0Fbpc/AwkUbM6QjmtYNqi'
TOKEN = ''


class SetUpTest(TestCase):
    def setUp(self):
        # create users
        u = User.objects.create(
            id=USER_ID, username=USERNAME, email=EMAIL, password_hash=PASSWORD_HASH)
        u2 = User.objects.create(id=USER_ID_2, username=USERNAME_2, email=EMAIL_2, password_hash=PASSWORD_HASH)
        u3 = User.objects.create(id=USER_ID_3, username=USERNAME_3, email=EMAIL_3, password_hash=PASSWORD_HASH)

        #assure 1 and 2 friends
        u.friends.add(u2)

        # create test community
        c = Community.objects.create(
            id=COMMUNITY_ID, name='TEST COMMUNITY', description='TEST COMMUNITY DESCRIPTION', owner=u)
        c.members.add(u)
        c.members.add(u3)
        # create test posts
        Post.objects.create(id=POST_ID, user=u, text='TEST POST',
                            datetime=datetime.now(), community=c)
        Post.objects.create(id=POST_ID_2, user=u2, text='TEST POST',
                            datetime=datetime.now(), community=None)
        Post.objects.create(id=POST_ID_3, user=u3, text='TEST POST',
                            datetime=datetime.now(), community=c)
        # simualte login for user 1
        response = CLIENT.post(
            '/api/auth/login', {'username': USERNAME, 'password': PASSWORD})
        global TOKEN
        TOKEN = response.json()['token']

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

"""
For User 1
Should return:
u's post because they made the post in one of their communities
u2's post because they're friends
u3's post because they're in the same community
"""
class RecentActivityTest1(SetUpTest):
    def test(self):
        response = CLIENT.get('/api/', headers={'Authorization': f'bearer {TOKEN}'})

        self.assertTrue('count' in response.json())
        self.assertTrue('next' in response.json())
        self.assertTrue('previous' in response.json())
        self.assertTrue('results' in response.json())
        
        results = response.json()['results']
        for post in results:
            self.assertTrue(self.check_post(post))

        self.assertTrue(len(results) == 3)
        
        self.assertTrue(results[0]['id'] == POST_ID_3)
        self.assertTrue(results[1]['id'] == POST_ID_2)
        self.assertTrue(results[2]['id'] == POST_ID)
        
"""
For User 2
Should return:
u1's post because they're friends
"""
class RecentActivityTest2(SetUpTest):
    def test(self):
        #simulate login for u2
        global TOKEN
        TOKEN = CLIENT.post('/api/auth/login', {'username': USERNAME_2, 'password': PASSWORD}).json()['token']

        response = CLIENT.get('/api/', headers={'Authorization': f'bearer {TOKEN}'})
        
        #debug
        print(response.json())

        self.assertTrue('count' in response.json())
        self.assertTrue('next' in response.json())
        self.assertTrue('previous' in response.json())
        self.assertTrue('results' in response.json())

        results = response.json()['results']
        self.assertTrue(len(results) == 1)
        self.assertTrue(results[0]['id'] == POST_ID)

"""
For User 3
Should return:
u1's because they're in the same community
"""
class RecentActivityTest3(SetUpTest):
    def test(self):
        #simulate login for u3
        global TOKEN
        TOKEN = CLIENT.post('/api/auth/login', {'username': USERNAME_3, 'password': PASSWORD}).json()['token']
        Post.objects.get(id=POST_ID_3).delete() # remove u3's post

        response = CLIENT.get('/api/', headers={'Authorization': f'bearer {TOKEN}'})

        #dbeug
        print(response.json())

        self.assertTrue('count' in response.json())
        self.assertTrue('next' in response.json())
        self.assertTrue('previous' in response.json())
        self.assertTrue('results' in response.json())

        results = response.json()['results']
        self.assertTrue(len(results) == 1)
        self.assertTrue(results[0]['id'] == POST_ID)

class UserPostsTestValid(SetUpTest):
    def test(self):
        response = CLIENT.get(f'/api/user/{USERNAME}/posts', headers={'Authorization': f'bearer {TOKEN}'})
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
        response = CLIENT.get(f'/api/user/OTHERUSER/posts', {'Authorization': f'bearer {TOKEN}'})
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())
