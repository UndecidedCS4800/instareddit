#!/usr/bin/env bash

set -o errexit
# npm --prefix frontend install 
# NODE_ENV="production" npm --prefix frontend run build
# cp -r frontend/dist backend/instareddit
pip install -r backend/requirements.txt
python3 backend/instareddit/manage.py migrate
