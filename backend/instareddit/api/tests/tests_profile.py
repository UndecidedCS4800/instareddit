from django.test import TestCase
from rest_framework.test import APIClient
from ..models import User

CLIENT = APIClient()

#predifned user
USERNAME = 'USER1'
EMAIL = 'user1@gmail.com'
PASSWORD = '12345678'
PASSWORD_HASH = '$2b$12$09H17WQZl5bZ6jjF4A60.ehJ0ZW2Gms/0Fbpc/AwkUbM6QjmtYNqi'

OTHER_USER = 'USER2'
OTHER_EMAIL = 'user2@gmail.com'
OTHER_PASSWORD = '12345678'
OTHER_PASSWORD_HASH = '$2b$12$09H17WQZl5bZ6jjF4A60.ehJ0ZW2Gms/0Fbpc/AwkUbM6QjmtYNqi'
#setup class
class TestUserSetup(TestCase):
    def setUp(self):
        User.objects.create(username=USERNAME, email=EMAIL, password_hash=PASSWORD_HASH)
        User.objects.create(username=OTHER_USERNAME, email=OTHER_EMAIL, password_hash=OTHER_PASSWORD_HASH)

class TestProfileNoProfile(TestUserSetup):
    def test(self):
        resp = CLIENT.get("/api/profile/not_real")
        self.assertEqual(resp.status_code, 400)
        self.assertTrue('error' in resp.json())

class TestProfileSelf(TestUserSetup):
    def test(self):
        resp = client.get("/api/profile/USER1")
        self.assertTrue("error" not in resp.json())
        



