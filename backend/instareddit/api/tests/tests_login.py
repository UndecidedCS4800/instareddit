from django.test import TestCase
from rest_framework.test import APIClient
from .. import models

CLIENT = APIClient()

#predifned user
USERNAME = 'USER1'
EMAIL = 'user1@gmail.com'
PASSWORD = '12345678'
PASSWORD_HASH = '$2b$12$09H17WQZl5bZ6jjF4A60.ehJ0ZW2Gms/0Fbpc/AwkUbM6QjmtYNqi'

#setup class
class TestUserSetup(TestCase):
    def setUp(self):
        models.User.objects.create(username=USERNAME, email=EMAIL, password_hash=PASSWORD_HASH)

class MissingUsernameLogin(TestUserSetup):
    def test(self):
        response = CLIENT.post('/api/auth/login', {'password': PASSWORD})
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

class MissingPasswordLogin(TestUserSetup):
    def test(self):
        response = CLIENT.post('/api/auth/login', {'username': USERNAME})
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

class MissingBodyLogin(TestUserSetup):
    def test(self):
        response = CLIENT.post('/api/auth/login')
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())
            
class InvalidUsernameLogin(TestUserSetup):
    def test(self):
        response = CLIENT.post('/api/auth/login', {'username': 'chuj', 'password': PASSWORD})
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

class InvalidPasswordLogin(TestUserSetup):
    def test(self):
        response = CLIENT.post('/api/auth/login', {'username': USERNAME, 'password': '123'})
        self.assertEqual(response.status_code, 401)
        self.assertTrue('error' in response.json())

class CorrectInputLogin(TestUserSetup):
    def test(self):
        response = CLIENT.post('/api/auth/login', {'username': USERNAME, 'password': PASSWORD})
        self.assertEqual(response.status_code, 200)
        self.assertTrue('username' in response.json())
        self.assertTrue('token' in response.json())