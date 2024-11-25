from django import forms

class UserRegisterForm(forms.Form):
    username = forms.CharField(max_length=50)
    email = forms.EmailField(max_length=100)
    password = forms.CharField()

class UserLoginForm(forms.Form):
    username = forms.CharField(max_length=50)
    password = forms.CharField()

class CommunityCreateForm(forms.Form):
    name = forms.CharField(max_length=100)
    description = forms.CharField()
    owner = forms.CharField()