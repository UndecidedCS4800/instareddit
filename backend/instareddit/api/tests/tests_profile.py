from django.test import TestCase
from rest_framework.test import APIClient
from ..models import User, UserInfo


CLIENT = APIClient()

#predifned user
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
OTHER_PASSWORD_HASH= '$2b$12$09H17WQZl5bZ6jjF4A60.ehJ0ZW2Gms/0Fbpc/AwkUbM6QjmtYNqi'
#setup class
class TestUserSetup(TestCase):
    def setUp(self):
       u =  User.objects.create(username = USERNAME, email = EMAIL, password_hash = PASSWORD_HASH)
       u_info = UserInfo.objects.create(user = User.objects.get(username = USERNAME), first_name = "Sample", last_name = "Sample", date_of_birth =  "1972-09-21", profile_picture = None)
       u2 = User.objects.create(username = OTHER_USER, email = OTHER_EMAIL, password_hash = OTHER_PASSWORD_HASH)
       response = CLIENT.post('/api/auth/login', data={'username':USERNAME, 'password':PASSWORD})
       global TOKEN
       TOKEN = response.json()['token']
       response_2 = CLIENT.post('/api/auth/login', data={'username':OTHER_USER, 'password':OTHER_PASSWORD})
       global OTHER_TOKEN
       OTHER_TOKEN = response_2.json()['token']

class GetUserInfo(TestUserSetup):
    def test(self):
        response = CLIENT.get(f'/api/profile/{USERNAME}',
                              headers={'Authorization':f'bearer {TOKEN}'})
        self.assertTrue('error' not in response.json())
        self.assertEqual(response.status_code, 200)

class WrongUsername(TestUserSetup):
    def test(self):
        response = CLIENT.get('/api/profile/not_real')
        self.assertEqual(response.status_code, 404)
        self.assertTrue('error' in response.json())

class TestNoUserInfo(TestUserSetup):
    def test(self):
        response = CLIENT.get(f'/api/profile/{OTHER_USER}',
                              headers={'Authorization':f'bearer {OTHER_TOKEN}'})
        self.assertEqual(response.status_code, 404)
        self.assertTrue('error' in response.json())

class TestProfileSelf(TestUserSetup):
    def test(self):
        response = CLIENT.get('/api/profile/',
                              headers={'Authorization':f'bearer {TOKEN}'})
        self.assertEqual(response.status_code, 200)
        self.assertTrue('error' not in response.json())

class TestProfileInvalidToken(TestUserSetup):
    def test(self):
        response = CLIENT.get('/api/profile/',
                              headers={'Authorization':f'bearer invalid'})
        self.assertEqual(response.status_code, 401)
        self.assertTrue('error' in response.json())

class TestSelfNoInfo(TestUserSetup):
    def test(self):
        response = CLIENT.get('/api/profile/',
                              headers={'Authorization':f'bearer {OTHER_TOKEN}'})
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

class TestPostInvalidToken(TestUserSetup):
    def test(self):
        response = CLIENT.post('/api/profile/',
                              headers={'Authorization':f'bearer invalid'})
        self.assertEqual(response.status_code, 401)
        self.assertTrue('error' in response.json())

class TestPostDataExists(TestUserSetup):
    def test(self):
        response = CLIENT.post('/api/profile/',
                              headers={'Authorization':f'bearer {TOKEN}'},
                              data={'first_name': 'first',
                                    'last_name': 'last',
                                    'date_of_birth': '1972-09-21',
                                    'profile_picture' : ''}, )
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

class TestPostNoFirstName(TestUserSetup):
    def test(self):
        response = CLIENT.post('/api/profile/',
                              headers={'Authorization':f'bearer {OTHER_TOKEN}'},
                              data={'first_name': '',
                                    'last_name': 'last',
                                    'date_of_birth': '1972-09-21',
                                    'profile_picture' : ''}, )
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

class TestPostNoLastName(TestUserSetup):
    def test(self):
        response = CLIENT.post('/api/profile/',
                              headers={'Authorization':f'bearer {OTHER_TOKEN}'},
                              data={'first_name': 'first',
                                    'last_name': '',
                                    'date_of_birth': '1972-09-21',
                                    'profile_picture' : ''}, )
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

class TestPostNotDOB(TestUserSetup):
    def test(self):
        response = CLIENT.post('/api/profile/',
                              headers={'Authorization':f'bearer {OTHER_TOKEN}'},
                              data={'first_name': 'first',
                                    'last_name': 'last',
                                    'date_of_birth': '',
                                    'profile_picture' : ''}, )
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

class TestPostInfo(TestUserSetup):
    def test(self):
        response = CLIENT.post('/api/profile/',
                              headers={'Authorization':f'bearer {OTHER_TOKEN}'},
                              data={'first_name': 'first',
                                    'last_name': 'last',
                                    'date_of_birth': '1972-09-21',
                                    'profile_picture' : ''}, )
        self.assertEqual(response.status_code, 201)
        self.assertTrue('error' not in response.json())

class TestPutInvalidToken(TestUserSetup):
    def test(self):
        response = CLIENT.post('/api/profile/',
                              headers={'Authorization':f'bearer invalid'})
        self.assertEqual(response.status_code, 401)
        self.assertTrue('error' in response.json())

class TestPutNoUserInfo(TestUserSetup):
    def test(self):
        response = CLIENT.put('/api/profile/',
                              headers={'Authorization':f'bearer {OTHER_TOKEN}'})
        self.assertEqual(response.status_code, 404)
        self.assertTrue('error' in response.json())

class TestPutInfoNewFirst(TestUserSetup):
    def test(self):
        response = CLIENT.put('/api/profile/',
                              headers={'Authorization':f'bearer {TOKEN}'},
                              data={'first_name': 'first'}, )
        self.assertEqual(response.status_code, 200)
        self.assertTrue('error' not in response.json())

class TestPutInfoNewLast(TestUserSetup):
    def test(self):
        response = CLIENT.put('/api/profile/',
                              headers={'Authorization':f'bearer {TOKEN}'},
                              data={'last_name': 'last'}, )
        self.assertEqual(response.status_code, 200)
        self.assertTrue('error' not in response.json())

class TestPutInfoNewDOB(TestUserSetup):
    def test(self):
        response = CLIENT.put('/api/profile/',
                              headers={'Authorization':f'bearer {TOKEN}'},
                              data={'date_of_birth': '2003-06-15'}, )
        self.assertEqual(response.status_code, 200)
        self.assertTrue('error' not in response.json())



