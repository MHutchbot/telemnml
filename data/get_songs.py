import json


files = ['minimal.json', 'bandcamp.json', 'electro.json']
result = []
for f in files:
    data = json.load(open(f))
    for ep in data:
        if 'files' in data[ep]:
            for song in data[ep]:
                result.append(song.update)
with open('songs0.json', 'w+') as f:
    json.dump(result, f, indent=4)
print(result)