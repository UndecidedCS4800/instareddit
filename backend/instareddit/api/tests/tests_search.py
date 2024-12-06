from django.test import TestCase
from rest_framework.test import APIClient
from ..models import User, Community

CLIENT = APIClient()

class SetUpTest(TestCase):
    def setUp(self):
        #create a bunch of users and communities
        user1 = User.objects.create(id=1, username='alice', email='alice@example.com', password_hash='hash_alice')
        user2 = User.objects.create(id=2, username='albert', email='albert@example.com', password_hash='hash_albert')
        user3 = User.objects.create(id=3, username='bob', email='bob@example.com', password_hash='hash_bob')
        user4 = User.objects.create(id=4, username='bonnie', email='bonnie@example.com', password_hash='hash_bonnie')
        user5 = User.objects.create(id=5, username='carol', email='carol@example.com', password_hash='hash_carol')
        user6 = User.objects.create(id=6, username='carl', email='carl@example.com', password_hash='hash_carl')
        user7 = User.objects.create(id=7, username='eve', email='eve@example.com', password_hash='hash_eve')

        community1 = Community.objects.create(
            id=1, name='Alpha Adventures',
            description='A community for exploring adventures and challenges.',
            owner=user1
        )
        community2 = Community.objects.create(
            id=2, name='Alpha Artists',
            description='A place for artists to showcase their work.',
            owner=user2
        )
        community3 = Community.objects.create(
            id=3, name='Bold Builders',
            description='A hub for builders and innovators.',
            owner=user3
        )
        community4 = Community.objects.create(
            id=4, name='Bold Bakers',
            description='A sweet space for baking enthusiasts.',
            owner=user4
        )
        community5 = Community.objects.create(
            id=5, name='Creative Coders',
            description='A community for coding and programming enthusiasts.',
            owner=user5
        )
        community6 = Community.objects.create(
            id=6, name='Creative Crafters',
            description='A group for sharing and learning craft skills.',
            owner=user6
        )
        community7 = Community.objects.create(
            id=7, name='Energized Entrepreneurs',
            description='A network for entrepreneurs to collaborate and grow.',
            owner=user7
        )

#al
class SearchTest1(SetUpTest):
    def test(self):
        response = CLIENT.get('/api/search/?query=al')
        users = response.json()['users']
        communities = response.json()['communities']

        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(users) == 2)
        self.assertTrue(len(communities) == 2)

        self.assertTrue(users[0]['username'] == 'alice')
        self.assertTrue(users[1]['username'] == 'albert')
        self.assertTrue(communities[0]['name'] == 'Alpha Adventures')
        self.assertTrue(communities[1]['name'] == 'Alpha Artists')

# bo
class SearchTest2(SetUpTest):
    def test(self):
        response = CLIENT.get('/api/search/?query=bo')
        users = response.json()['users']
        communities = response.json()['communities']

        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(users) == 2)
        self.assertTrue(len(communities) == 2)

        self.assertTrue(users[0]['username'] == 'bob')
        self.assertTrue(users[1]['username'] == 'bonnie')
        self.assertTrue(communities[0]['name'] == 'Bold Builders')
        self.assertTrue(communities[1]['name'] == 'Bold Bakers')

# ca
class SearchTest3(SetUpTest):
    def test(self):
        response = CLIENT.get('/api/search/?query=ca')
        users = response.json()['users']
        communities = response.json()['communities']

        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(users) == 2)
        self.assertTrue(len(communities) == 0)

        self.assertTrue(users[0]['username'] == 'carol')
        self.assertTrue(users[1]['username'] == 'carl')

# e
class SearchTest4(SetUpTest):
    def test(self):
        response = CLIENT.get('/api/search/?query=e')
        users = response.json()['users']
        communities = response.json()['communities']

        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(users) == 1)
        self.assertTrue(len(communities) == 1)

        self.assertTrue(users[0]['username'] == 'eve')
        self.assertTrue(communities[0]['name'] == 'Energized Entrepreneurs')

# cr
class SearchTest5(SetUpTest):
    def test(self):
        response = CLIENT.get('/api/search/?query=cr')
        users = response.json()['users']
        communities = response.json()['communities']

        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(users) == 0)
        self.assertTrue(len(communities) == 2)

        self.assertTrue(communities[0]['name'] == 'Creative Coders')
        self.assertTrue(communities[1]['name'] == 'Creative Crafters')

# c
class SearchTest6(SetUpTest):
    def test(self):
        response = CLIENT.get('/api/search/?query=c')
        users = response.json()['users']
        communities = response.json()['communities']

        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(users) == 2)
        self.assertTrue(len(communities) == 2)

        self.assertTrue(users[0]['username'] == 'carol')
        self.assertTrue(users[1]['username'] == 'carl')
        self.assertTrue(communities[0]['name'] == 'Creative Coders')
        self.assertTrue(communities[1]['name'] == 'Creative Crafters')
