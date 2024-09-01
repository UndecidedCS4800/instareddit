FROM python:3

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
RUN django-admin startproject instareddit
RUN python instareddit/manage.py migrate
COPY . .

EXPOSE 8000
CMD [ "python", "instareddit/manage.py", "runserver", "0.0.0.0:8000"]


