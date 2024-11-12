from django.test import TestCase
from rest_framework.test import APIClient
from ..models import User

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
        global USER_TOKEN
        resp = CLIENT.POST("/api/auth/register", { "username": USERNAME, "password": PASSWORD, "email": EMAIL})
        json = resp.json()
        if "error" not in json:
            USER_TOKEN = json['token']
            CLIENT.credentials(HTTP_AUTHORIZATION=f"bearer {USER_TOKEN}")


class TestProfileNoProfile(TestUserSetup):
    def test(self):
        resp = CLIENT.get("/api/profile/not_real")
        self.assertEqual(resp.status_code, 400)
        self.assertTrue('error' in resp.json())

class TestProfilePublicSelf(TestUserSetup):
    def test(self):
        resp = CLIENT.get("/api/profile/USER1")
        self.assertTrue("error" not in resp.json())
        self.assertEqual(resp.statusCode, 200)

class TestProfileSelf(TestUserSetup):
    def test(self):
        resp = CLIENT.get("/api/profile/")
        json = resp.json()
        self.assertTrue("error" not in json)
        self.assertEqual(resp.statusCode, 200)
    
class TestSameProfile(TestUserSetup):
    def test(self):
        ext_resp = CLIENT.get("/api/profile/USER1")
        er_json = ext_resp.json()
        self.assertTrue("error" not in er_json)
        self.assertEqual(ext_resp.statusCode, 200)

        self_profile = CLIENT.get("/api/profile/")
        sp_json = self_profile.json()
        self.assertTrue("error" not in sp_json)
        self.assertEqual(self_profile.statusCode, 200)

        self.assertEqual(sp_json, er_json)

class TestRejectUnauthorizedSelf(TestUserSetup):
    def test(self):
        temp = APIClient()
        
        resp = temp.get("/api/profile")
        json = resp.json()
        self.assertEqual(resp.statusCode, 404)
        self.assertTrue("error" in json)

class TestPOSTValid(TestUserSetup):
    def test(self):
        resp = CLIENT.post("/api/profile", USER_INFO)
        json = resp.json()
        self.assertEqual(json, USER_INFO)
        self.assertEqual(resp.statusCode, 200)

class TestPostNoFirstName(TestUserSetup):
    def test(self):
        resp = CLIENT.post("/api/profile", {i: USER_INFO[i] for i in USER_INFO if i != "first_name"})
        json = resp.json()
        self.assertEqual(resp.statusCode, 400)
        self.assertTrue("error" in json)

class TestPostNoLastName(TestUserSetup):
    def test(self):
        resp = CLIENT.post("/api/profile", {i: USER_INFO[i] for i in USER_INFO if i != "last_name"})
        json = resp.json()
        self.assertEqual(resp.statusCode, 400)
        self.assertTrue("error" in json)

class TestPostNoDateOfBirth(TestUserSetup):
    def test(self):
        resp = CLIENT.post("/api/profile", {i: USER_INFO[i] for i in USER_INFO if i != "date_of_birth"})
        json = resp.json()
        self.assertEqual(resp.statusCode, 400)
        self.assertTrue("error" in json)

class TestPostNoDateOfBirth(TestUserSetup):
    def test(self):
        resp = CLIENT.post("/api/profile", {i: USER_INFO[i] for i in USER_INFO if i != "date_of_birth"})
        json = resp.json()
        self.assertEqual(resp.statusCode, 400)
        self.assertTrue("error" in json)

class TestPostNoProfilePicture(TestUserSetup):
    def test(self):
        resp = CLIENT.post("/api/profile", {i: USER_INFO[i] for i in USER_INFO if i != "profile_picture"})
        json = resp.json()
        self.assertEqual(resp.statusCode, 400)
        self.assertTrue("error" in json)



