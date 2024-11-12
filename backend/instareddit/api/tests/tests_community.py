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

class SetUpTest(TestCase):
    def setUp(self):
        u = User.objects.create(username=USERNAME, email=EMAIL, password_hash=PASSWORD_HASH)
        c = Community.objects.create(id=COMMUNITY_ID, name='Test Community', description='For testing', owner=User.objects.get(username=USERNAME))
        Post.objects.create(id=POST_ID, user=u, text="test post", datetime=datetime.now(), community=c)

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

class GetCommunityPost(SetUpTest):
    def test(self):
        response = CLIENT.get(f'/api/community/{COMMUNITY_ID}/post/{POST_ID}')
        p = Post.objects.get(id=POST_ID)
        p_dict = PostSerializer(p).data
        self.assertTrue('comments' in response.json())
        r_dict = response.json()
        r_dict.pop('comments')
        self.assertDictEqual(p_dict, r_dict)