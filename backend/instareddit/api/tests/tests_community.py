from django.test import TestCase
from rest_framework.test import APIClient
from ..models import Community

CLIENT = APIClient()

COMMUNITY_ID = 1

#assure there is a paginated list of communities
# class GetCommunities(TestCase):
#     def test(self):
#         response = CLIENT.get('api/communities')
#         self.assertIn('count', response.json())
#         self.assertIn('next', response.json())
#         self.assertIn('previous', response.json())
#         self.assertIn('results', response.json())