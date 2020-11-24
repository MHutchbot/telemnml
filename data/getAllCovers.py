import requests
import json
from bs4 import BeautifulSoup

count = 0
songs = json.load(open("songs.json", "r"))

for song in songs:
    if "hasAlbumImage" in song:
        print("DONE   ", count, "/", len(songs))
        count += 1
        continue
    try:
        a = requests.get(song["channelLink"])
    except:
        print("INVA    ", count, "/", len(songs))
        count += 1
        songs[songs.index(song)]["hasAlbumImage"] = False
        songs[songs.index(song)]["hasPreview"] = False
        songs[songs.index(song)]["embedLink"] = ""
        songs[songs.index(song)]["imageLink"] = ""
        continue
    
    a = requests.get(song["channelLink"])
    soup = BeautifulSoup(a.text, 'lxml')
    meta = soup.find_all('meta', {"property": "og:video"})
    img = soup.find_all('meta', {"property": "og:image"})
    
    if len(img) == 0:
        img = soup.find_all('meta', {"name": "og:image"})    

    if len(img) == 0:
        print ("IMG: X | EMB: X   ", count, "/", len(songs))
        songs[songs.index(song)]["hasAlbumImage"] = False
        songs[songs.index(song)]["hasPreview"] = False
        songs[songs.index(song)]["embedLink"] = ""
        songs[songs.index(song)]["imageLink"] = ""

    elif len(meta) == 0:
        print ("IMG: O | EMB: X", count, "/", len(songs))
        songs[songs.index(song)]["hasAlbumImage"] = True
        songs[songs.index(song)]["hasPreview"] = False
        songs[songs.index(song)]["embedLink"] = ""
        songs[songs.index(song)]["imageLink"] = img[0]["content"]

    else:
        print ("IMG: O | EMB: O", count, "/", len(songs))
        songs[songs.index(song)]["hasAlbumImage"] = True
        songs[songs.index(song)]["hasPreview"] = True
        songs[songs.index(song)]["embedLink"] = meta[0]["content"]
        songs[songs.index(song)]["imageLink"] = img[0]["content"]

    count += 1
    open("songs.json", "w+").write(json.dumps(songs, indent=2))

for song in songs:
    if ".swf" in song["embedLink"]:
        songs[songs.index(song)]["hasPreview"] = False

open("songs.json", "w+").write(json.dumps(songs, indent=2))
