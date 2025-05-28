#!/usr/bin/env python

"""README

Env Vars:
  - IMGUR_CLIENT_ID :: imgur app client id
  - IMGUR_ACCESS_TOKEN :: imgur app access token

Usage:
  ./_tools/_imgur_upload.py

References:
  - package docs :: https://imgur-python.readthedocs.io/en/latest/config/
  - package repo :: https://github.com/faustocarrera/imgur-python
  - imgur api docs :: https://apidocs.imgur.com/#c85c9dfc-7487-4de2-9ecd-66f727cf3139
"""

from os import path, getenv, listdir
from imgur_python import Imgur
from sys import exit
from datetime import datetime
from zoneinfo import ZoneInfo
from pprint import pprint
from time import sleep

asset_dir = "./media_staging"
#
asset_paths = [f"{asset_dir}/{f}" for f in listdir(asset_dir)]
client_id = getenv("IMGUR_CLIENT_ID")
access_token = getenv("IMGUR_ACCESS_TOKEN")
today = datetime.now(ZoneInfo("America/Los_Angeles")).strftime("%Y_%m_%d")
album_name = f"sleepyblog_{today}"

imgur_client = Imgur(
    {
        "client_id": client_id,
        "access_token": access_token,
        "token_type": "bearer",
    }
)
images = {}  # id: link


for i, file in enumerate(asset_paths):
    ext = file.split(".")[-1]
    image = imgur_client.image_upload(
        path.realpath(file),
        f"{i+1}",
        f"sleepyblog image {i+1}/{len(asset_paths)} for {today}",
    )
    image_id = image["response"]["data"]["id"]
    images[image_id] = image["response"]["data"]["link"]

try:
    image_keys = list(images.keys())
    sleep(10)
    album = imgur_client.album_create(image_keys, album_name, album_name, "public")
except Exception as e:
    print(f"Error creating album: {e}\n\t{image_keys=}\n\t{album_name=}")
    exit(1)
album_id = album["response"]["data"]["id"]
response = imgur_client.gallery_album(album_id, album_name, 0, "")

print(f"{'─'*5}")
print([link for link in list(images.values())])
print(f"{'─'*5}")

exit(0)
