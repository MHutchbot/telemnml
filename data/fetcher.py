from pyrogram import Client, MessageHandler
import json
import requests

songs = json.load(open("songs.json", "r"))

def saveJSON():
    json.dump(songs, open("songs.json", "w"), indent=2)
    print("saved")

app = Client(
    "bot",
    bot_token="1393671351:AAGHav8Ftr8ReXa_ehnlYyYIZZrwjKAIppo"
)

def my_function(client, message):
    print(message)
    if message["chat"]["id"] != -1001277035735:
        return
    name = message["caption"]
    fileid = message["audio"]["file_id"]
    newSongs = json.load(open("songs.json", "r"))
    songs = newSongs if newSongs[0]["name"] != songs[0]["name"] else songs
    for song in songs:
        if song["name"] == name:
            resp = requests.get("https://api.telegram.org/bot1393671351:AAGHav8Ftr8ReXa_ehnlYyYIZZrwjKAIppo/getFile?file_id=" + fileid)
            print(resp.json())
            songs[songs.index(song)]["link"] = "https://api.telegram.org/file/bot1393671351:AAGHav8Ftr8ReXa_ehnlYyYIZZrwjKAIppo/" + resp.json()["result"]["file_path"]
            songs[songs.index(song)]["clickCount"] += 1
            open("currentLink", "w").write(songs[songs.index(song)]["link"])
            open("songs.json", "w").write(json.dumps(songs, indent=2))
            print(songs[songs.index(song)]["link"])
    saveJSON()
    # AGGIUNGERE IL FILE ID A SONGS.JSON

my_handler = MessageHandler(my_function)
app.add_handler(my_handler)

app.run()
