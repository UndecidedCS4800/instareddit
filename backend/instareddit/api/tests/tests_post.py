from django.test import TestCase
from rest_framework.test import APIClient
from ..models import Community, User, Post, Like, Dislike, Comment
from ..serializers import CommunitySerializer, PostSerializer
from datetime import datetime

CLIENT = APIClient()

COMMUNITY_ID = 1
POST_ID = 1
POST_ID_2 = 2
POST_ID_3 = 3

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
        # create users
        u = User.objects.create(
            id=USER_ID, username=USERNAME, email=EMAIL, password_hash=PASSWORD_HASH)
        u2 = User.objects.create(id=USER_ID_2, username=USERNAME_2, email=EMAIL_2, password_hash=PASSWORD_HASH)
        u3 = User.objects.create(id=USER_ID_3, username=USERNAME_3, email=EMAIL_3, password_hash=PASSWORD_HASH)

        #assure 1 and 2 friends
        u.friends.add(u2)

        # create test community
        c = Community.objects.create(
            id=COMMUNITY_ID, name='TEST COMMUNITY', description='TEST COMMUNITY DESCRIPTION', owner=u)
        c.members.add(u)
        c.members.add(u3)
        # create test posts
        Post.objects.create(id=POST_ID, user=u, text='TEST POST',
                            datetime=datetime.now(), community=c)
        Post.objects.create(id=POST_ID_2, user=u2, text='TEST POST',
                            datetime=datetime.now(), community=None)
        Post.objects.create(id=POST_ID_3, user=u3, text='TEST POST',
                            datetime=datetime.now(), community=c)
        # simualte login for user 1
        response = CLIENT.post(
            '/api/auth/login', {'username': USERNAME, 'password': PASSWORD})
        global TOKEN
        TOKEN = response.json()['token']

    def check_post(self, p):
        return (
            'id' in p,
            'user' in p,
            'username' in p,
            'text' in p,
            'image' in p,
            'datetime' in p,
            'community' in p,
            'community_name' in p,
        )

# TODO ADD RECENTPOSTSVIEW TEST

"""
For User 1
Should return:
u's post because they made the post in one of their communities
u2's post because they're friends
u3's post because they're in the same community
"""
class RecentActivityTest1(SetUpTest):
    def test(self):
        response = CLIENT.get('/api/', headers={'Authorization': f'bearer {TOKEN}'})

        print('HERE', response.json()) #debug

        self.assertTrue('count' in response.json())
        self.assertTrue('next' in response.json())
        self.assertTrue('previous' in response.json())
        self.assertTrue('results' in response.json())
        
        results = response.json()['results']
        for post in results:
            self.assertTrue(self.check_post(post))

        self.assertTrue(len(results) == 3)
        
        self.assertTrue(results[0]['id'] == POST_ID_3)
        self.assertTrue(results[1]['id'] == POST_ID_2)
        self.assertTrue(results[2]['id'] == POST_ID)
        
"""
For User 2
Should return:
u1's post because they're friends
own post
"""
class RecentActivityTest2(SetUpTest):
    def test(self):
        #simulate login for u2
        global TOKEN
        TOKEN = CLIENT.post('/api/auth/login', {'username': USERNAME_2, 'password': PASSWORD}).json()['token']

        response = CLIENT.get('/api/', headers={'Authorization': f'bearer {TOKEN}'})
        
        #debug
        print('HERE', response.json())

        self.assertTrue('count' in response.json())
        self.assertTrue('next' in response.json())
        self.assertTrue('previous' in response.json())
        self.assertTrue('results' in response.json())

        results = response.json()['results']
        self.assertTrue(len(results) == 2)
        self.assertTrue(results[0]['id'] == POST_ID_2)
        self.assertTrue(results[1]['id'] == POST_ID)

"""
For User 3
Should return:
u1's because they're in the same community
we are deleting u3's own post
"""
class RecentActivityTest3(SetUpTest):
    def test(self):
        #simulate login for u3
        global TOKEN
        TOKEN = CLIENT.post('/api/auth/login', {'username': USERNAME_3, 'password': PASSWORD}).json()['token']
        Post.objects.get(id=POST_ID_3).delete() # remove u3's post

        response = CLIENT.get('/api/', headers={'Authorization': f'bearer {TOKEN}'})

        #dbeug
        print(response.json())

        self.assertTrue('count' in response.json())
        self.assertTrue('next' in response.json())
        self.assertTrue('previous' in response.json())
        self.assertTrue('results' in response.json())

        results = response.json()['results']
        self.assertTrue(len(results) == 1)
        self.assertTrue(results[0]['id'] == POST_ID)

class UserPostsTestValid(SetUpTest):
    def test(self):
        response = CLIENT.get(f'/api/user/{USERNAME}/posts', headers={'Authorization': f'bearer {TOKEN}'})
        self.assertEqual(response.status_code, 200)
        self.assertTrue('count' in response.json())
        self.assertTrue('next' in response.json())
        self.assertTrue('previous' in response.json())
        self.assertTrue('results' in response.json())
        p = response.json()['results'][0] if len(response.json()['results']) > 0 else None
        if p:
            self.assertTrue(self.check_post(p))

class UserPostsTestInvalid(SetUpTest):
    def test(self):
        response = CLIENT.get(f'/api/user/OTHERUSER/posts', {'Authorization': f'bearer {TOKEN}'})
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

class GetPostValid(SetUpTest):
    def test(self):
        response = CLIENT.get(f'/api/user/{USERNAME}/posts/{POST_ID}')
        self.assertTrue(self.check_post(response.json()))
        self.assertEqual(response.status_code, 200)
    
class GetPostInvalidUser(SetUpTest):
    def test(self):
        response = CLIENT.get(f'/api/user/OTHERUSER/posts/{POST_ID}')
        self.assertTrue('error' in response.json())
        self.assertEqual(response.status_code, 400)
    
class GetPostInvalidPost(SetUpTest):
    def test(self):
        response = CLIENT.get(f'/api/user/{USERNAME}/posts/0')
        self.assertTrue('error' in response.json())
        self.assertEqual(response.status_code, 400)
    
class UpdatePostValid(SetUpTest):
    def test(self):
        response = CLIENT.patch(
            f'/api/user/{USERNAME}/posts/{POST_ID}',
            data={'text': 'NEW TEXT AFTER EDIT'},
            headers={'Authorization': f'bearer {TOKEN}'}
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue(self.check_post(response.json()))
        self.assertEqual(response.json()['text'],  'NEW TEXT AFTER EDIT')
        p = Post.objects.get(id=POST_ID)
        self.assertEqual(p.text, 'NEW TEXT AFTER EDIT')
    
class UpdatePostInvalidUser(SetUpTest):
    def test(self):
        response = CLIENT.patch(
            f'/api/user/OTHERUSER/posts/{POST_ID}',
            data={'text': 'NEW TEXT AFTER EDIT'},
            headers={'Authorization': f'bearer {TOKEN}'}
        )
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

class UpdatePostUnauthorizedUser(SetUpTest):
    def test(self):
        #simulate login for u2
        token = CLIENT.post('/api/auth/login', {'username': USERNAME_2, 'password': PASSWORD}).json()['token']

        response = CLIENT.patch(
            f'/api/user/{USERNAME}/posts/{POST_ID}',
            data={'text': 'NEW TEXT AFTER EDIT'},
            headers={'Authorization': f'bearer {token}'}
        )  
        self.assertEqual(response.status_code, 401)
        self.assertTrue('error' in response.json())
    
class UpdatePostInvalidPost(SetUpTest):
    def test(self):
        response = CLIENT.patch(
            f'/api/user/{USERNAME}/posts/0',
            data={'text': 'NEW TEXT AFTER EDIT'},
            headers={'Authorization': f'bearer {TOKEN}'}
        )
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())
    
class DeletePostValid(SetUpTest):
    def test(self):
        response = CLIENT.delete(
            f'/api/user/{USERNAME}/posts/{POST_ID}',
            headers={'Authorization': f'bearer {TOKEN}'}
        )
        self.assertEqual(response.status_code, 200)
        p = Post.objects.filter(id=POST_ID).first()
        self.assertIsNone(p)
    
class DeletePostInvalidUser(SetUpTest):
    def test(self):
        response = CLIENT.delete(
            f'/api/user/OTHERUSER/posts/{POST_ID}',
            headers={'Authorization': f'bearer {TOKEN}'}
        )
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())
    
class DeletePostUnauthorizedUser(SetUpTest):
    def test(self):
        #simulate login for u2
        token = CLIENT.post('/api/auth/login', {'username': USERNAME_2, 'password': PASSWORD}).json()['token']

        response = CLIENT.delete(
            f'/api/user/{USERNAME}/posts/{POST_ID}',
            headers={'Authorization': f'bearer {token}'}
        )  
        self.assertEqual(response.status_code, 401)
        self.assertTrue('error' in response.json())    
    
class DeletePostInvalidPost(SetUpTest):
    def test(self):
        response = CLIENT.delete(
            f'/api/user/{USERNAME}/posts/0',
            headers={'Authorization': f'bearer {TOKEN}'}
        )
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())
    
class LikesCreateValid(SetUpTest):
    def test(self):
        response = CLIENT.post(
            f'/api/posts/{POST_ID_2}/like',
            headers={'Authorization': f'bearer {TOKEN}'}
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue('id' in response.json())
        self.assertTrue('user' in response.json())
        self.assertTrue('username' in response.json())
        self.assertTrue('post' in response.json())
        self.assertTrue('datetime' in response.json())
        like = Like.objects.filter(id=response.json()['id']).first()
        self.assertIsNotNone(like)
        self.assertEqual(like.post.id, POST_ID_2)
    
class LikesCreateInvalidPost(SetUpTest):
    def test(self):
        response = CLIENT.post(
            f'/api/posts/0/like',
            headers={'Authorization': f'bearer {TOKEN}'}
        )
        self.assertEqual(response.status_code, 404)
        self.assertTrue('error' in response.json())
    
class LikesCreateDouble(SetUpTest):
    def test(self):
        CLIENT.post(
            f'/api/posts/{POST_ID_2}/like',
            headers={'Authorization': f'bearer {TOKEN}'}
        )
        response = CLIENT.post(
            f'/api/posts/{POST_ID_2}/like',
            headers={'Authorization': f'bearer {TOKEN}'}
        )
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())
    
class LikesGetValid(SetUpTest):
    def test(self):
        Like.objects.create(
            id=1, 
            user=User.objects.get(id=USER_ID), 
            post=Post.objects.get(id=POST_ID_2),
            datetime=datetime.now()
        )
        Like.objects.create(
            id=2, 
            user=User.objects.get(id=USER_ID_3), 
            post=Post.objects.get(id=POST_ID_2),
            datetime=datetime.now()
        )
        response = CLIENT.get(f'/api/posts/{POST_ID_2}/like')
        self.assertTrue(len(response.json()) == 2)
        self.assertTrue(response.json()[0]['id'] == 1)
        self.assertTrue(response.json()[1]['id'] == 2)
        self.assertEqual(response.status_code, 200)

class LikesGetInvalidPost(SetUpTest):
    def test(self):
        response = CLIENT.get(f'/api/posts/0/like')
        self.assertEqual(response.status_code, 404)
        self.assertTrue('error' in response.json())
    
class LikesDeleteValid(SetUpTest):
    def test(self):
        Like.objects.create(
            id=1, 
            user=User.objects.get(id=USER_ID), 
            post=Post.objects.get(id=POST_ID_2),
            datetime=datetime.now()
        )
        response = CLIENT.delete(
            f'/api/posts/{POST_ID_2}/likes/1',
            headers={'Authorization': f'bearer {TOKEN}'}
        )
        self.assertEqual(response.status_code, 200)
        like = Like.objects.filter(id=1).first()
        self.assertIsNone(like)

class LikesDeleteInvalidPost(SetUpTest):
    def test(self):
        Like.objects.create(
            id=1, 
            user=User.objects.get(id=USER_ID), 
            post=Post.objects.get(id=POST_ID_2),
            datetime=datetime.now()
        )
        response = CLIENT.delete(
            f'/api/posts/0/likes/1',
            headers={'Authorization': f'bearer {TOKEN}'}
        )
        print(response.json())
        self.assertEqual(response.status_code, 404)
        self.assertTrue('error' in response.json())

class LikesDeleteInvalidUser(SetUpTest):
    def test(self):
        Like.objects.create(
            id=1, 
            user=User.objects.get(id=USER_ID), 
            post=Post.objects.get(id=POST_ID_2),
            datetime=datetime.now()
        )

        #simulate login for user 3
        token = CLIENT.post('/api/auth/login', {'username': USERNAME_3, 'password': PASSWORD}).json()['token']

        response = CLIENT.delete(
            f'/api/posts/{POST_ID_2}/likes/1',
            headers={'Authorization': f'bearer {token}'}
        )
        print(response.json())
        self.assertEqual(response.status_code, 403)
        self.assertTrue('error' in response.json())

class LikesDeleteDouble(SetUpTest):
    def test(self):
        Like.objects.create(
            id=1, 
            user=User.objects.get(id=USER_ID), 
            post=Post.objects.get(id=POST_ID_2),
            datetime=datetime.now()
        )
        CLIENT.delete(
            f'/api/posts/{POST_ID_2}/likes/1',
            headers={'Authorization': f'bearer {TOKEN}'}
        )
        response = CLIENT.delete(
            f'/api/posts/{POST_ID_2}/likes/1',
            headers={'Authorization': f'bearer {TOKEN}'}
        )
        self.assertEqual(response.status_code, 404)
        self.assertTrue('error' in response.json())

class DislikesCreateValid(SetUpTest):
    def test(self):
        response = CLIENT.post(
            f'/api/posts/{POST_ID_2}/dislike',
            headers={'Authorization': f'bearer {TOKEN}'}
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue('id' in response.json())
        self.assertTrue('user' in response.json())
        self.assertTrue('username' in response.json())
        self.assertTrue('post' in response.json())
        self.assertTrue('datetime' in response.json())
        dislike = Dislike.objects.filter(id=response.json()['id']).first()
        self.assertIsNotNone(dislike)
        self.assertEqual(dislike.post.id, POST_ID_2)
    
class DislikesCreateInvalidPost(SetUpTest):
    def test(self):
        response = CLIENT.post(
            f'/api/posts/0/dislike',
            headers={'Authorization': f'bearer {TOKEN}'}
        )
        self.assertEqual(response.status_code, 404)
        self.assertTrue('error' in response.json())
    
class DislikesCreateDouble(SetUpTest):
    def test(self):
        CLIENT.post(
            f'/api/posts/{POST_ID_2}/dislike',
            headers={'Authorization': f'bearer {TOKEN}'}
        )
        response = CLIENT.post(
            f'/api/posts/{POST_ID_2}/dislike',
            headers={'Authorization': f'bearer {TOKEN}'}
        )
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())
    
class DislikesGetValid(SetUpTest):
    def test(self):
        Dislike.objects.create(
            id=1, 
            user=User.objects.get(id=USER_ID), 
            post=Post.objects.get(id=POST_ID_2),
            datetime=datetime.now()
        )
        Dislike.objects.create(
            id=2, 
            user=User.objects.get(id=USER_ID_3), 
            post=Post.objects.get(id=POST_ID_2),
            datetime=datetime.now()
        )
        response = CLIENT.get(f'/api/posts/{POST_ID_2}/dislike')
        self.assertTrue(len(response.json()) == 2)
        self.assertTrue(response.json()[0]['id'] == 1)
        self.assertTrue(response.json()[1]['id'] == 2)
        self.assertEqual(response.status_code, 200)

class DislikesGetInvalidPost(SetUpTest):
    def test(self):
        response = CLIENT.get(f'/api/posts/0/dislike')
        self.assertEqual(response.status_code, 404)
        self.assertTrue('error' in response.json())
    
class DislikesDeleteValid(SetUpTest):
    def test(self):
        Dislike.objects.create(
            id=1, 
            user=User.objects.get(id=USER_ID), 
            post=Post.objects.get(id=POST_ID_2),
            datetime=datetime.now()
        )
        response = CLIENT.delete(
            f'/api/posts/{POST_ID_2}/dislikes/1',
            headers={'Authorization': f'bearer {TOKEN}'}
        )
        self.assertEqual(response.status_code, 200)
        dislike = Dislike.objects.filter(id=1).first()
        self.assertIsNone(dislike)

class DislikesDeleteInvalidPost(SetUpTest):
    def test(self):
        Dislike.objects.create(
            id=1, 
            user=User.objects.get(id=USER_ID), 
            post=Post.objects.get(id=POST_ID_2),
            datetime=datetime.now()
        )
        response = CLIENT.delete(
            f'/api/posts/0/dislikes/1',
            headers={'Authorization': f'bearer {TOKEN}'}
        )
        print(response.json())
        self.assertEqual(response.status_code, 404)
        self.assertTrue('error' in response.json())

class DislikesDeleteInvalidUser(SetUpTest):
    def test(self):
        Dislike.objects.create(
            id=1, 
            user=User.objects.get(id=USER_ID), 
            post=Post.objects.get(id=POST_ID_2),
            datetime=datetime.now()
        )

        #simulate login for user 3
        token = CLIENT.post('/api/auth/login', {'username': USERNAME_3, 'password': PASSWORD}).json()['token']

        response = CLIENT.delete(
            f'/api/posts/{POST_ID_2}/dislikes/1',
            headers={'Authorization': f'bearer {token}'}
        )
        print(response.json())
        self.assertEqual(response.status_code, 403)
        self.assertTrue('error' in response.json())

class DislikesDeleteDouble(SetUpTest):
    def test(self):
        Dislike.objects.create(
            id=1, 
            user=User.objects.get(id=USER_ID), 
            post=Post.objects.get(id=POST_ID_2),
            datetime=datetime.now()
        )
        CLIENT.delete(
            f'/api/posts/{POST_ID_2}/dislikes/1',
            headers={'Authorization': f'bearer {TOKEN}'}
        )
        response = CLIENT.delete(
            f'/api/posts/{POST_ID_2}/dislikes/1',
            headers={'Authorization': f'bearer {TOKEN}'}
        )
        self.assertEqual(response.status_code, 404)
        self.assertTrue('error' in response.json())

class CommentsCreateValid(SetUpTest):
    def test(self):
        response = CLIENT.post(
            f'/api/posts/{POST_ID_2}/comment',
            data={'text': 'TEST COMMENT'},
            headers={'Authorization': f'bearer {TOKEN}'}
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue('id' in response.json())
        self.assertTrue('user' in response.json())
        self.assertTrue('username' in response.json())
        self.assertTrue('post' in response.json())
        self.assertTrue('datetime' in response.json())
        self.assertTrue('text' in response.json())
        comment = Comment.objects.filter(id=response.json()['id']).first()
        self.assertIsNotNone(comment)
        self.assertEqual(comment.post.id, POST_ID_2)
    
class CommentsCreateInvalidPost(SetUpTest):
    def test(self):
        response = CLIENT.post(
            f'/api/posts/0/comment',
            data={'text': 'TEST COMMENT'},
            headers={'Authorization': f'bearer {TOKEN}'}
        )
        self.assertEqual(response.status_code, 404)
        self.assertTrue('error' in response.json())
    
    
class CommentsGetValid(SetUpTest):
    def test(self):
        Comment.objects.create(
            id=1, 
            user=User.objects.get(id=USER_ID), 
            post=Post.objects.get(id=POST_ID_2),
            text='TEST COMMENT',
            datetime=datetime.now()
        )
        Comment.objects.create(
            id=2, 
            user=User.objects.get(id=USER_ID_3), 
            post=Post.objects.get(id=POST_ID_2),
            text='TEST COMMENT',
            datetime=datetime.now()
        )
        response = CLIENT.get(f'/api/posts/{POST_ID_2}/comment')
        self.assertTrue(len(response.json()) == 2)
        self.assertTrue(response.json()[0]['id'] == 1)
        self.assertTrue(response.json()[1]['id'] == 2)
        self.assertEqual(response.status_code, 200)

class CommentsGetInvalidPost(SetUpTest):
    def test(self):
        response = CLIENT.get(f'/api/posts/0/comment')
        self.assertEqual(response.status_code, 404)
        self.assertTrue('error' in response.json())
    
class CommentsDeleteValid(SetUpTest):
    def test(self):
        Comment.objects.create(
            id=1, 
            user=User.objects.get(id=USER_ID), 
            post=Post.objects.get(id=POST_ID_2),
            text='TEST COMMENT',
            datetime=datetime.now()
        )
        response = CLIENT.delete(
            f'/api/posts/{POST_ID_2}/comments/1',
            headers={'Authorization': f'bearer {TOKEN}'}
        )
        self.assertEqual(response.status_code, 200)
        comment = Comment.objects.filter(id=1).first()
        self.assertIsNone(comment)

class CommentsDeleteInvalidPost(SetUpTest):
    def test(self):
        Comment.objects.create(
            id=1, 
            user=User.objects.get(id=USER_ID), 
            post=Post.objects.get(id=POST_ID_2),
            text='TEST COMMENT',
            datetime=datetime.now()
        )
        response = CLIENT.delete(
            f'/api/posts/0/comments/1',
            headers={'Authorization': f'bearer {TOKEN}'}
        )
        print(response.json())
        self.assertEqual(response.status_code, 404)
        self.assertTrue('error' in response.json())

class CommentsDeleteInvalidUser(SetUpTest):
    def test(self):
        Comment.objects.create(
            id=1, 
            user=User.objects.get(id=USER_ID), 
            post=Post.objects.get(id=POST_ID_2),
            text='TEST COMMENT',
            datetime=datetime.now()
        )

        #simulate login for user 3
        token = CLIENT.post('/api/auth/login', {'username': USERNAME_3, 'password': PASSWORD}).json()['token']

        response = CLIENT.delete(
            f'/api/posts/{POST_ID_2}/comments/1',
            headers={'Authorization': f'bearer {token}'}
        )
        print(response.json())
        self.assertEqual(response.status_code, 403)
        self.assertTrue('error' in response.json())

class CommentsDeleteDouble(SetUpTest):
    def test(self):
        Comment.objects.create(
            id=1, 
            user=User.objects.get(id=USER_ID), 
            post=Post.objects.get(id=POST_ID_2),
            text='TEST COMMENT',
            datetime=datetime.now()
        )
        CLIENT.delete(
            f'/api/posts/{POST_ID_2}/comments/1',
            headers={'Authorization': f'bearer {TOKEN}'}
        )
        response = CLIENT.delete(
            f'/api/posts/{POST_ID_2}/comments/1',
            headers={'Authorization': f'bearer {TOKEN}'}
        )
        self.assertEqual(response.status_code, 404)
        self.assertTrue('error' in response.json())
