from django.test import TestCase, Client
from rest_framework.test import APIClient
from . import models

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
        user = models.User.objects.filter(username=USERNAME).first()
        self.assertIsNotNone(user)
        user = models.User.objects.filter(email=EMAIL).first()
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
        
#login tests
class MissingUsernameLogin(TestCase):
    def test(self):
        response = CLIENT.post('/api/auth/login', {'password':PASSWORD})
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())
        self.assertEqual(response.json()['error'], 'Invalid form')
        
class MissingPasswordLogin(TestCase):
    def test(self):
        response = CLIENT.post('/api/auth/login', {'username': USERNAME})
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())
        self.assertEqual(response.json()['error'], 'Invalid form')
        
class UsernameDoesNotExistLogin(TestCase):
    def test(self):
        response = CLIENT.post('/api/auth/login', {'username': 'DoesNotExist', 'password': PASSWORD})
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())
        self.assertEqual(response.json()['error'], 'User with this username does not exist')
        
class IncorrectPasswordLogin(TestCase):   
    def setUp(self):
        response = CLIENT.post('/api/auth/register', {'username': USERNAME, 'password': PASSWORD, 'email': EMAIL})
        self.assertEqual(response.status_code, 201)
        
    def test(self):
        response = CLIENT.post('/api/auth/login', {'username': USERNAME, 'password': 'WrongPassword'})
        self.assertEqual(response.status_code, 401)
        self.assertTrue('error' in response.json())
        self.assertEqual(response.json()['error'], 'Incorrect password')
    
    def tearDown(self):
        models.User.objects.filter(username=USERNAME).delete()
        
class CorrectLogin(TestCase):
    def setUp(self):
        response = CLIENT.post('/api/auth/register', {'username': USERNAME, 'password': PASSWORD, 'email': EMAIL})
        self.assertEqual(response.status_code, 201)
    
    def test(self):
        response = CLIENT.post('/api/auth/login', {'username': USERNAME, 'password': PASSWORD})
        self.assertTrue('username' in response.json())
        self.assertTrue('token' in response.json())
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['username'], USERNAME)
        
    def tearDown(self):
        models.User.objects.filter(username=USERNAME).delete()
        

#profile views tests
class MissingUsernameProfile(TestCase):
    def test(self):
        response = CLIENT.get('/api/profile/invalid_username')
        self.assertEqual(response.status_code, 400)
        self.assertTrue(response.json(), 'Invalid Username')
 
#valid username but no userinfo
class MissingUserInfo(TestCase):
    def test(self):
        models.User.objects.create(username=USERNAME, email=EMAIL)
        response = CLIENT.get(f'/api/profile/{USERNAME}')
        self.assertEqual(response.status_code, 400)
        self.assertTrue(response.json(), 'No user info for given username')

#valid username and userinfo
class ValidProfileRetrival(TestCase):
    def setUp(self):
        self.user = models.User.objects.create(username=USERNAME, email=EMAIL)
        self.user_info = models.UserInfo.objects.create(
            user = self.user,
            first_name = 'Boop',
            last_name = 'Doop',
            date_of_birth = '2000-01-01'
        )
        
    def tearDown(self):
        self.user.delete()
        self.user_info.delete()
        
    def test(self):     
        response = CLIENT.get(f'/api/profile/{USERNAME}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['first_name'], 'Boop')
        self.assertEqual(response.json()['last_name'], 'Doop')
        self.assertEqual(response.json()['date_of_birth'], '2000-01-01')