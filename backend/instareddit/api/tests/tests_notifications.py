from django.test import TestCase
from rest_framework.test import APIClient
from ..models import  User, Post, Like, Comment, Community
from datetime import datetime
from django.utils.timezone import make_aware
from django.utils.timezone import now

#python3 manage.py test api.tests.tests_notifications

CLIENT = APIClient()

COMMUNITY_ID = 1
POST_ID = 1
POST_ID_2 = 2
POST_ID_3 = 3

LIKE_ID = 1
LIKE_ID_2 = 2
LIKE_ID_3 = 3

COMMENT_ID = 1
COMMENT_ID_2 = 2
COMMENT_ID_3 = 3

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
		#create users
		u = User.objects.create(id=USER_ID, username=USERNAME, email=EMAIL, password_hash=PASSWORD_HASH)
		u2 = User.objects.create(id=USER_ID_2, username=USERNAME_2, email=EMAIL_2, password_hash=PASSWORD_HASH)
		u3 = User.objects.create(id=USER_ID_3, username=USERNAME_3, email=EMAIL_3, password_hash=PASSWORD_HASH)

		#create community
		c = Community.objects.create(id=COMMUNITY_ID, name='TEST COMMUNITY', description='TEST COMMUNITY DESCRIPTION', owner=u)
		
		#create posts
		post1 = Post.objects.create(id = POST_ID, user = u, text = "TEST POST", datetime = datetime.now(),community=c)
		post2 = Post.objects.create(id = POST_ID_2, user = u, text = "TEST POST", datetime = datetime.now(),community=c)
		post3 = Post.objects.create(id = POST_ID_3, user = u, text = "TEST POST", datetime= datetime.now(),community=c)

		#test timestamp
		timestampTest = 5000  # Example timestamp
		datetime_obj = datetime.fromtimestamp(timestampTest)

		#create likes
		Like.objects.create(id = LIKE_ID, user =  u2, post = post1, datetime = datetime_obj)
		Like.objects.create(id = LIKE_ID_2, user =  u2, post = post2, datetime = datetime.now())
		Like.objects.create(id = LIKE_ID_3, user =  u3, post = post2, datetime = datetime.now())

		#create comments
		Comment.objects.create(id = COMMENT_ID, user = u3, post = post3, datetime = datetime_obj)
		Comment.objects.create(id = COMMENT_ID_2, user = u2, post = post3, datetime = datetime.now())
		Comment.objects.create(id = COMMENT_ID_3, user = u2, post = post1, datetime = datetime.now())
		
		#login user1
		response = CLIENT.post('/api/auth/login',
			    {'username': USERNAME, 'password': PASSWORD})
		global TOKEN
		TOKEN = response.json()['token']

class TestNotificationsLikesInvalidToken(SetUpTest):
	def test(self):
		response = CLIENT.get('/api/profile/notifications/likes',
			  headers={'Authorization': f'bearer invalid'})
		self.assertEqual(response.status_code, 401)
		self.assertTrue('error' in response.json())

class TestNotificationsLikesInvalidTimeStamp(SetUpTest):
	def test(self):
		response = CLIENT.get('/api/profile/notifications/likes?when=invalid',
			  headers={'Authorization':f'bearer {TOKEN}'})
		self.assertEqual(response.status_code, 400)
		self.assertTrue('error' in response.json())

class TestNotificationsLikesValidTimeStamp(SetUpTest):
	def test(self):

		timestamp = 1000
		response = CLIENT.get(f'/api/profile/notifications/likes?when={timestamp}',
			  headers={'Authorization':f'bearer {TOKEN}'})
		self.assertEqual(response.status_code, 200)
		self.assertTrue('error' not in response.json())

		likes = response.json()
		self.assertGreater(len(likes), 0)
		self.assertEqual(len(likes), 3)

class TestNotifications2Likes(SetUpTest):
	def test(self):

		timestamp = 5001
		response = CLIENT.get(f'/api/profile/notifications/likes?when={timestamp}',
			  headers={'Authorization':f'bearer {TOKEN}'})
		self.assertEqual(response.status_code, 200)
		self.assertTrue('error' not in response.json())

		likes = response.json()
		self.assertGreater(len(likes), 0)
		self.assertEqual(len(likes), 2)
class TestNotificationsCommentsInvalidToken(SetUpTest):
	def test(self):
		response = CLIENT.get('/api/profile/notifications/comments',
			  headers={'Authorization': f'bearer invalid'})
		self.assertEqual(response.status_code, 401)
		self.assertTrue('error' in response.json())

class TestNotificationsCommentsInvalidTimeStamp(SetUpTest):
	def test(self):
		response = CLIENT.get('/api/profile/notifications/comments?when=invalid',
			  headers={'Authorization':f'bearer {TOKEN}'})
		self.assertEqual(response.status_code, 400)
		self.assertTrue('error' in response.json())

class TestNotificationsCommentsValidTimeStamp(SetUpTest):
	def test(self):

		timestamp = 1000
		response = CLIENT.get(f'/api/profile/notifications/comments?when={timestamp}',
			  headers={'Authorization':f'bearer {TOKEN}'})
		self.assertEqual(response.status_code, 200)
		self.assertTrue('error' not in response.json())

		comments = response.json()
		self.assertGreater(len(comments), 0)
		self.assertEqual(len(comments), 3)

class TestNotifications2Comments(SetUpTest):
	def test(self):

		timestamp = 5001
		response = CLIENT.get(f'/api/profile/notifications/comments?when={timestamp}',
			  headers={'Authorization':f'bearer {TOKEN}'})
		self.assertEqual(response.status_code, 200)
		self.assertTrue('error' not in response.json())

		comments = response.json()
		self.assertGreater(len(comments), 0)
		self.assertEqual(len(comments), 2)


		
		
	