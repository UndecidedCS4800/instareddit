from django.test import TestCase
from rest_framework.test import APIClient
from ..models import User

#set up client
CLIENT = APIClient()

#set up username, password, email for new user
USERNAME = 'NEW_USER'
EMAIL = 'newemail@gmail.com'
PASSWORD = 'TestPassword2137'

class MissingUsernameRegister(TestCase):
    def test(self):
        response = CLIENT.post('/api/auth/register', {'password':PASSWORD, 'email':EMAIL})
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

class InvalidUsernameRegister(TestCase):
    def test(self):
        response = CLIENT.post('/api/auth/register', {'username': '', 'password':PASSWORD, 'email':EMAIL})
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

class MissingPasswordRegister(TestCase):
    def test(self):
        response = CLIENT.post('/api/auth/register', {'username':USERNAME, 'email':EMAIL})
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

class MissingEmailRegister(TestCase):
    def test(self):
        response = CLIENT.post('/api/auth/register', {'username':USERNAME, 'password':PASSWORD})
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

class InvalidEmailRegister(TestCase):
    def test(self):
        response = CLIENT.post('/api/auth/register', {'username':USERNAME, 'password':PASSWORD, 'email':'hej.com'})
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

class PasswordTooShortRegister(TestCase):
    def test(self):
        response = CLIENT.post('/api/auth/register', {'username':USERNAME, 'password':'a', 'email':EMAIL})
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

class PasswordTooCommonRegister(TestCase):
    def test(self):
        response = CLIENT.post('/api/auth/register', {'username':USERNAME, 'password':'12345678', 'email':EMAIL})
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

class CorrectInputRegister(TestCase):
    def test(self):
        response = CLIENT.post('/api/auth/register', {'username':USERNAME, 'password':PASSWORD, 'email':EMAIL})
        self.assertTrue('username' in response.json())
        self.assertTrue('token' in response.json())
        self.assertEqual(response.status_code, 201)
        user = User.objects.filter(username=USERNAME).first()
        self.assertIsNotNone(user)
        user = User.objects.filter(email=EMAIL).first()
        self.assertIsNotNone(user)

class TakenUsernameRegister(TestCase):
    def test(self):
        CLIENT.post('/api/auth/register', {'username':USERNAME, 'password':PASSWORD, 'email':EMAIL})
        response = CLIENT.post('/api/auth/register', {'username':USERNAME, 'password':PASSWORD, 'email':'test@email.com'})
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

class TakenEmailRegister(TestCase):
    def test(self):
        CLIENT.post('/api/auth/register', {'username':USERNAME, 'password':PASSWORD, 'email':EMAIL})
        response = CLIENT.post('/api/auth/register', {'username':'SomeOtherUser', 'password':PASSWORD, 'email':EMAIL})
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())