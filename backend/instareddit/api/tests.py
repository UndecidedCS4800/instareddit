from django.test import TestCase, Client
from rest_framework.test import APIClient

#set up client
#using USER1's data
TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlVTRVIxIiwiaWQiOjF9.YdYTk6mLJMS4oEdeibADHR53nLppjQRN9qyJKReUehs'
CLIENT_AUTH = APIClient(headers={'Authorization': f'bearer {TOKEN}'})
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

#try with username that already exists

