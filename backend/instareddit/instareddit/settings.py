"""
Django settings for instareddit project.

Generated by 'django-admin startproject' using Django 5.1.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.1/ref/settings/
"""

from pathlib import Path
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
# SECURITY WARNING: don't run with debug turned on in production!
# DEBUG =  "DJANGO_DEBUG" in os.environ or "RENDER" not in os.environ
DEBUG=True
SECRET_KEY = 'django-insecure-a3^=ra1a5v15z)@a#t99wldmwxrpk2(i#sa5oaw7q&ut5vydbz'
if not DEBUG:
    SECRET_KEY = os.environ.get('SECRET_KEY', default='your secret key')

ALLOWED_HOSTS = ["localhost", "52.41.36.82", "54.191.253.12", "44.226.122.3", "instareddit-1.onrender.com"]
RENDER_EXTERNAL_HOSTNAME = os.environ.get('RENDER_EXTERNAL_HOSTNAME')
if RENDER_EXTERNAL_HOSTNAME:    
    ALLOWED_HOSTS.append(RENDER_EXTERNAL_HOSTNAME)


# Application definition

INSTALLED_APPS = [
    "corsheaders",
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'api'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    "corsheaders.middleware.CorsMiddleware",
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'instareddit.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': ["instareddit/index/templates"],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
            'libraries': {
            }
        },
    },
]

WSGI_APPLICATION = 'instareddit.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

# db = {}
# local_db = bool(os.environ.get('USE_LOCAL_DB'))
# if local_db:
db = {
    'ENGINE': 'django.db.backends.mysql',
    'NAME': os.environ.get('MARIA_DB_NAME'),
    'HOST': os.environ.get('MARIA_DB_HOST'),
    'PORT':'3306',
    'USER': os.environ.get('MARIA_DB_USER'),
    'PASSWORD': os.environ.get('MARIA_DB_PASSWORD'),
}

if os.environ.get('MARIA_DB_USE_SSL') is not None:
    db |= { 'OPTIONS': { 'ssl': {'ca': os.environ.get("SSL_PEM_ABSOLUTE_PATH", default="global-bundle.pem") }}}

#CORS ORIGINS
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "https://instareddit.onrender.com:10000",
    "https://instareddit.onrender.com:443",
    "https://instareddit-1.onrender.com:10000",
    "https://instareddit-1.onrender.com:443"
]
# else:
#     db = {
#         #TODO add params for aws DB
#     }

DATABASES = {
    'default': db
}


# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = '/dist/'
STATICFILES_DIRS = [
    BASE_DIR / "dist",
]
WHITENOISE_ROOT = "dist/"


STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
# Enable the WhiteNoise storage backend, which compresses static files to reduce disk use
# and renames the files with unique names for each version to support long-term caching
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
