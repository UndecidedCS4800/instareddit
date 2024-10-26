from rest_framework import views, status
from rest_framework.response import Response
from .. import models, forms
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
import bcrypt
import jwt
import os

SALT = bcrypt.gensalt()

#registers a new user
#request should be POST with body containing username, email, and password
class RegisterUserView(views.APIView):
    def post(self, request, *args, **kwargs):
        # get data from request, validate form and return error status if data incomplete
        form = forms.UserRegisterForm(request.data)
        if not form.is_valid(): 
            #   error_response = {} #return all errors in one response
            #   #check if username is not an empty field
            #   if 'username' in form.errors:
            #       error_response['username'] = form.errors['username']
            #   #check if password is not an empty field
            #   if 'password' in form.errors:
            #       error_response['password'] = form.errors['password']
            #   #check if email is in the correct format
            #   if 'email' in form.errors:
            #       error_response['email'] = form.errors['email']
              return Response({'error': 'Invalid form'}, status=status.HTTP_400_BAD_REQUEST)
              
        username = form.cleaned_data['username']
        email = form.cleaned_data['email']
        password = form.cleaned_data['password']
        
	 #check if password is too weak
        try:
            #checks to make sure password is over 8 characters, not common and not only numeric
            validate_password(password)
        except ValidationError as e:
            message = " ".join(e.messages)
            return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)

        # check if user already exists
        if models.User.objects.filter(username=username).exists():
            return Response({'error': "Username is already taken."}, status=status.HTTP_400_BAD_REQUEST)
        
        if models.User.objects.filter(email=email).exists():
            return Response({'error':"User with this email is already used." }, status=status.HTTP_400_BAD_REQUEST)

        #hash password
        pw_bytes = password.encode('utf-8') #convert to bytes
        pw_hash = bcrypt.hashpw(pw_bytes, SALT)
        pw_hash = pw_hash.decode('utf-8') #convert hashed password back to string to store in DB

        #store user in DB 
        #TODO match fields with final User model
        new_user = models.User(username=username, email=email, password_hash=pw_hash)
        new_user.save()
        user_id = new_user.id

        #generate token
        key = os.environ.get('TOKEN_KEY')
        token = jwt.encode({'username': username, 'id': user_id}, key, algorithm='HS256')

        response = {'username': username, 'token': token}
        return Response(response, status=status.HTTP_201_CREATED)

class LoginView(views.APIView):
    def post(self, request, *args, **kwargs):
        #validate data with form
        form = forms.UserLoginForm(request.data)
        if not form.is_valid(): 
            # error_message = {} #include all form errors in reponse
            # if 'username' in form.errors:
            #     error_message['username'] = form.errors['username']
            # if 'password' in form.errors:
            #     error_message['password'] = form.errors['password']
            return Response({'error': 'Invalid form'}, status=status.HTTP_400_BAD_REQUEST)
        
        # get data
        username = form.cleaned_data['username']
        password = form.cleaned_data['password']
        pw_bytes = password.encode('utf-8') #convert password to bytes
        
        # Check if user exists already
        if not models.User.objects.filter(username=username).exists():
            return Response({'error' : "User with this username does not exist"}, status=status.HTTP_400_BAD_REQUEST)
        
        #get user and password hash from DB
        user = models.User.objects.get(username=username)
        user_id = user.id
        hashpass = user.password_hash
        hashpass_bytes = hashpass.encode('utf-8') # convert hashed pw to bytes
          
        # check if password matches the hashed pw from db
        if bcrypt.checkpw(pw_bytes, hashpass_bytes):
            key = os.environ.get('TOKEN_KEY')
            token = jwt.encode({'username': username, 'id': user_id}, key, algorithm='HS256')
            response = {'username': username, 'token': token}
            return Response(response, status=status.HTTP_200_OK)
        else:
            return Response({'error' : "Incorrect password"}, status=status.HTTP_401_UNAUTHORIZED)
        
def verify_token(request):
    # Extract the token from the Authorization header
    auth_header = request.headers.get('Authorization')

    if auth_header and auth_header.startswith('bearer '):
        # Extract the token part after 'bearer '
        token = auth_header.split(' ')[1]
    else:
        token = None

    return token

def authorize(token):
    if not token:
            raise ValueError
    #get user id and username from token
    decoded_token = jwt.decode(token, os.environ.get('TOKEN_KEY'), algorithms=['HS256'])
    return decoded_token['id'], decoded_token['username']