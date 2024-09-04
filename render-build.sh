#!/usr/bin/env bash

set -o errexit
npm --prefix frontend install 
npm --prefix frontend run build
cp -r frontend/dist backend/instareddit
pip install -r backend/requirements.txt
python3 backend/instareddit/manage.py collectstatic --no-input
python3 backend/instareddit/manage.py migrate
