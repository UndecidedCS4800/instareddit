from django.test import TestCase
from rest_framework.test import APIClient
from ..models import Community, User, Post
from ..serializers import CommunitySerializer, PostSerializer
from datetime import datetime

CLIENT = APIClient()

COMMUNITY_ID = 1
POST_ID = 1
USERNAME = 'USER1'
EMAIL = 'user1@gmail.com'
PASSWORD = '12345678'
PASSWORD_HASH = '$2b$12$09H17WQZl5bZ6jjF4A60.ehJ0ZW2Gms/0Fbpc/AwkUbM6QjmtYNqi'
TOKEN = ''

OTHER_USERNAME = 'otherGuy'
OTHER_EMAIL = 'otheruser@gmail.com'
OTHER_TOKEN = ''

class SetUpTest(TestCase):
    def setUp(self):
        u = User.objects.create(username=USERNAME, email=EMAIL, password_hash=PASSWORD_HASH)
        u2 = User.objects.create(username=OTHER_USERNAME, email=OTHER_EMAIL, password_hash=PASSWORD_HASH)
        c = Community.objects.create(id=COMMUNITY_ID, name='Test Community', description='For testing', owner=User.objects.get(username=USERNAME))
        c.admins.add(u)
        Post.objects.create(id=POST_ID, user=u, text="test post", datetime=datetime.now(), community=c)
        #simulate login
        response = CLIENT.post('/api/auth/login', data={'username':USERNAME, 'password':PASSWORD})
        global TOKEN
        TOKEN = response.json()['token']
        response_2 = CLIENT.post('/api/auth/login', data={'username':OTHER_USERNAME, 'password':PASSWORD})
        global OTHER_TOKEN
        OTHER_TOKEN = response_2.json()['token']
        

#assure there is a paginated list of communities
class GetCommunities(SetUpTest):
    def test(self):
        response = CLIENT.get('/api/communities')
        self.assertIn('count', response.json())
        self.assertIn('next', response.json())
        self.assertIn('previous', response.json())
        self.assertIn('results', response.json())

class GetCommunityPosts(SetUpTest):
    def test(self):
        response = CLIENT.get(f'/api/community/{COMMUNITY_ID}')
        self.assertIn('count', response.json())
        self.assertIn('next', response.json())
        self.assertIn('previous', response.json())
        self.assertIn('results', response.json())

class GetCommunityDetail(SetUpTest):
    def test(self):
        c = Community.objects.get(id=COMMUNITY_ID)
        response = CLIENT.get(f'/api/community/{COMMUNITY_ID}/about')
        c_dict = CommunitySerializer(c).data
        self.assertDictEqual(c_dict, response.json())

#add error tests for those \/ \/ \/
class ChangeCommunityDetailName(SetUpTest):
    def test(self):
        response = CLIENT.patch(
            f'/api/community/{COMMUNITY_ID}/about', 
            data={'name': 'NEW NAME'}, 
            headers={'Authorization':f'bearer {TOKEN}'})
        c = Community.objects.get(id=COMMUNITY_ID)
        c_dict = CommunitySerializer(c).data
        self.assertDictEqual(c_dict, response.json())
        self.assertEqual(response.status_code, 200)

class ChangeCommunityDetailDescription(SetUpTest):
    def test(self):
        response = CLIENT.patch(
            f'/api/community/{COMMUNITY_ID}/about', 
            data={'description': 'NEW DESCRIPTION'}, 
            headers={'Authorization':f'bearer {TOKEN}'})
        c = Community.objects.get(id=COMMUNITY_ID)
        c_dict = CommunitySerializer(c).data
        self.assertDictEqual(c_dict, response.json())
        self.assertEqual(response.status_code, 200)

class ChangeCommunityDetailBoth(SetUpTest):
    def test(self):
        response = CLIENT.patch(
            f'/api/community/{COMMUNITY_ID}/about', 
            data={'name':'NEW NAME 2', 'description': 'NEW DESCRIPTION 2'}, 
            headers={'Authorization':f'bearer {TOKEN}'})
        c = Community.objects.get(id=COMMUNITY_ID)
        c_dict = CommunitySerializer(c).data
        self.assertDictEqual(c_dict, response.json())
        self.assertEqual(response.status_code, 200)

class GetCommunityPost(SetUpTest):
    def test(self):
        response = CLIENT.get(f'/api/community/{COMMUNITY_ID}/post/{POST_ID}')
        p = Post.objects.get(id=POST_ID)
        p_dict = PostSerializer(p).data
        self.assertTrue('comments' in response.json())
        r_dict = response.json()
        r_dict.pop('comments')
        self.assertDictEqual(p_dict, r_dict)

#TODO adding/removing admins and possible errors
"""
possible errors:
- invalid community id
- unauthorized (not an admin)
- username not provided
- username invalid
- user already an admin
"""

class AdminAddInvalidCommunityID(SetUpTest):
    def test(self):
        response = CLIENT.post(
            '/api/community/404/admin',
            data={'username': OTHER_USERNAME},
            headers={'Authorization': f'bearer {TOKEN}'}
        )
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

class AdminAddUnauthorized(SetUpTest):
    def test(self):
        response = CLIENT.post(
            f'/api/community/{COMMUNITY_ID}/admin',
            data={'username': OTHER_USERNAME},
            headers={'Authorization': f'bearer {OTHER_TOKEN}'}
        )
        self.assertEqual(response.status_code, 401)
        self.assertTrue('error' in response.json())

class AdminAddNoUsername(SetUpTest):
    def test(self):
        response = CLIENT.post(
            f'/api/community/{COMMUNITY_ID}/admin',
            headers={'Authorization': f'bearer {TOKEN}'}
        )
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

class AdminAddInvalidUsername(SetUpTest):
    def test(self):
        response = CLIENT.post(
            f'/api/community/{COMMUNITY_ID}/admin',
            data={'username': 'INVALID_USER'},
            headers={'Authorization': f'bearer {TOKEN}'}
        )
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

class AdminAddCorrectInput(SetUpTest):
    def test(self):
        response = CLIENT.post(
            f'/api/community/{COMMUNITY_ID}/admin',
            data={'username': OTHER_USERNAME},
            headers={'Authorization': f'bearer {TOKEN}'}
        )
        self.assertEqual(response.status_code, 200)
        c = Community.objects.get(id=COMMUNITY_ID)
        print('ADMINS', c.admins.all())
        new_admin = c.admins.filter(username=OTHER_USERNAME).first()
        self.assertIsNotNone(new_admin)

class AdminAddUserAlreadyAdmin(SetUpTest):
    def test(self):
        c = Community.objects.get(id=COMMUNITY_ID)
        u2 = User.objects.get(username=OTHER_USERNAME)
        c.admins.add(u2)
        response = CLIENT.post(
            f'/api/community/{COMMUNITY_ID}/admin',
            data={'username': OTHER_USERNAME},
            headers={'Authorization': f'bearer {TOKEN}'}
        )
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json()) 

#deleting an admin
"""
possible errors:
- invalid community id
- unauthorized (not an admin)
- username not provided
- username invalid
- user not an admin
"""

class AdminDeleteInvalidCommunityID(SetUpTest):
    def test(self):
        response = CLIENT.delete(
            '/api/community/404/admin',
            data={'username': OTHER_USERNAME},
            headers={'Authorization': f'bearer {TOKEN}'}
        )
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

class AdminDeleteUnauthorized(SetUpTest):
    def test(self):
        response = CLIENT.delete(
            f'/api/community/{COMMUNITY_ID}/admin',
            data={'username': OTHER_USERNAME},
            headers={'Authorization': f'bearer {OTHER_TOKEN}'}
        )
        self.assertEqual(response.status_code, 401)
        self.assertTrue('error' in response.json())

class AdminDeleteNoUsername(SetUpTest):
    def test(self):
        response = CLIENT.delete(
            f'/api/community/{COMMUNITY_ID}/admin',
            headers={'Authorization': f'bearer {TOKEN}'}
        )
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

class AdminDeleteInvalidUsername(SetUpTest):
    def test(self):
        response = CLIENT.delete(
            f'/api/community/{COMMUNITY_ID}/admin',
            data={'username': 'INVALID_USER'},
            headers={'Authorization': f'bearer {TOKEN}'}
        )
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

class AdminDeleteUserNotAnAdmin(SetUpTest):
    def test(self):
        response = CLIENT.delete(
            f'/api/community/{COMMUNITY_ID}/admin',
            data={'username': OTHER_USERNAME},
            headers={'Authorization': f'bearer {TOKEN}'}
        )
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json()) 

class AdminDeleteCorrectInput(SetUpTest):
    def test(self):
        c = Community.objects.get(id=COMMUNITY_ID)
        u2 = User.objects.get(username=OTHER_USERNAME)
        c.admins.add(u2)
        response = CLIENT.delete(
            f'/api/community/{COMMUNITY_ID}/admin',
            data={'username': OTHER_USERNAME},
            headers={'Authorization': f'bearer {TOKEN}'}
        )
        self.assertEqual(response.status_code, 200)
        admin = c.admins.filter(username=OTHER_USERNAME).first()
        self.assertIsNone(admin)