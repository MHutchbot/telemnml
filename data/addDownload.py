import json

obj = json.load(open("songs.json"))

for song in obj:
    obj[obj.index(song)]["clickCount"] = 0

json.dump(obj, open("songs.json", "w"), indent=2)