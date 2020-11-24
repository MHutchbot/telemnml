from pyrogram import Client
import json

songs = json.load(open("songs.json"))

api_id = 1536807
api_hash = "1540bfb84f5137a5641b439ed7ec48fe"

def progress(current, total):
    print("{:.1f}%".format(current * 100 / total))

with Client("my_account", api_id, api_hash) as app:
    message = app.get_messages(app.get_chat('https://t.me/joinchat/AAAAAFMkfyufDjJ6otWIhA').id, 638)
    print(message)
    app.download_media(message, progress=progress)