import json

minimal = json.load(open("minimal.json"))
electro = json.load(open("electro.json"))
bandcamp = json.load(open("bandcamp.json"))
oldSongs = json.load(open("songs.json"))
songs = []
count = 0
length = len(minimal.keys())+len(electro.keys())+len(bandcamp.keys())
jsons = [minimal, electro, bandcamp]

for obj in jsons:
    for el in obj:
        if "files" not in obj[el]:
            continue
        link = ""
        print(count, length)
        for song in obj[el]["files"]:
            newSong = True
            embedLink = ""
            coverLink = ""
            hasCover = False
            hasEmbed = False
            for oldSong in oldSongs:
                if oldSong["name"] == song["name"]:
                    newSong = False
                    if oldSong["hasAlbumImage"]:
                        hasCover = True
                        coverLink = oldSong["imageLink"]
                    if oldSong["hasPreview"]:
                        hasEmbed = True
                        embedLink = oldSong["embedLink"]
            if newSong:
                try:
                    song.update({
                        "cat": obj[el]["cat"], 
                        "quality": obj[el]["quality"], 
                        "albumName": obj[el]["name"], 
                        "mocklink": "https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_5MG.mp3",
                        "channelLink": obj[el]["link"].split("Link: ")[1].split(" ")[0] if "Link:" in obj[el]["link"] else obj[el]["link"],
                        "albumImg": "https://www.indigenousmusicawards.com/img/placeholder-music.png",
                        "clickCount": 0
                    })
                    songs.append(song)
                except Exception as e:
                    print(e, el, song)
            else:
                try:
                    song.update({
                        "cat": obj[el]["cat"], 
                        "quality": obj[el]["quality"], 
                        "albumName": obj[el]["name"], 
                        "mocklink": "https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_5MG.mp3",
                        "channelLink": obj[el]["link"].split("Link: ")[1].split(" ")[0] if "Link:" in obj[el]["link"] else obj[el]["link"],
                        "albumImg": "https://www.indigenousmusicawards.com/img/placeholder-music.png",
                        "clickCount": 0,
                        "hasAlbumImage": hasCover,
                        "hasPreview": hasEmbed,
                        "embedLink": embedLink,
                        "imageLink": coverLink
                    })
                    songs.append(song)
                except Exception as e:
                    print(e, el, song)
        count += 1
songs = sorted(songs, key=lambda k: k["id"])
songs.reverse()
#json.dump(songs, open("songs.json", "wb"), indent=2)
open("songs.json", "w+").write(json.dumps(songs, indent=2))
