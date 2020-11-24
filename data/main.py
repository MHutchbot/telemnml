import sys
import re
import zipfile
import os
import json
import time
import _thread

from pyrogram import Client
from pydub import AudioSegment
import fleep

MINIMAL = -1001394900779
ELECTRO = -1001377388579
BANDCAMP = -1001447176749
TELEMNML = -1001373896039
DEBUG = -1001270440763
CACHECHANNEL = -1001277035735

app = Client('VNWebBot')


def compress(file_name):
    ext = re.findall(r'\..+', file_name)[-1]
    print(ext)
    path = f'downloads/{file_name}'
    '''
    if ext == '.zip':
        os.rename(f'downloads/{file_name}', f'downloads/{file_name}'[:-3]+info.extension)
        file_name = file_name[:-3]+info.extension
        path = f'downloads/{file_name}'
        ext = info.extension
    '''
    oldext = ext
    with open(path, "rb") as file:
        info = fleep.get(file.read(128))
        print(info.extension)
    if len(info.extension) == 0:
        print("len extension = 0")
        os.rename(f'downloads/{file_name}', f'downloads/{file_name}'[:-(len(oldext)-1)]+"aiff")
        file_name = file_name[:-(len(oldext)-1)]+"aiff"
        path = f'downloads/{file_name}'
        ext = "aiff"
    else:
        os.rename(f'downloads/{file_name}', f'downloads/{file_name}'[:-(len(oldext)-1)]+info.extension[0])
        file_name = file_name[:-(len(oldext)-1)]+info.extension[0]
        path = f'downloads/{file_name}'
        ext = info.extension[0]
    print(path)
    audio = AudioSegment.from_file(path, ext)
    audio = audio[:min(len(audio), 300000)]
    file_name = file_name.replace(ext, '')
    audio.export(f'downloads/{file_name}.mp3', format="mp3")
    os.remove(path)
    return f'downloads/{file_name}.mp3'

def get_data(message_id, chat_id):
    for msg in app.iter_history(chat_id, reverse=True):
        if msg.message_id == message_id:
            if msg.document:
                data = {
                    'file_id': msg.document.file_id,
                    'file_ref': msg.document.file_ref,
                }
            elif msg.audio:
                data = {
                    'file_id': msg.audio.file_id,
                    'file_ref': msg.audio.file_ref,
                }
            elif msg.voice:
                data = {
                    'file_id': msg.voice.file_id,
                    'file_ref': msg.voice.file_ref,
                }
            return data


def get_chat_id(chat):
    if chat == 'minimal':
        return MINIMAL
    elif chat == 'bandcamp':
        return BANDCAMP
    elif chat == 'electro':
        return ELECTRO
    elif chat == 'debug':
        return DEBUG


def startTimer(name):
    time.sleep(300)
    os.remove("./iscurrent")
    songs = json.load(open("./songs.json", "r"))
    for song in songs:
        if song["name"] == name:
            songs[songs.index(song)]["link"] = "error"
    print("5 minutes passed.")
    os._exit(1)

def main(message_id, chat, name):
    with app:
        open("./iscurrent", "w+").close()
        chat_id = get_chat_id(chat)
        data = get_data(message_id, chat_id)
        print(data)
        #_thread.start_new_thread(startTimer, (name, ""))
        print("timer started")
        path = app.download_media(
            data['file_id'],
            file_ref=data['file_ref']
        )
        print("file downloaded")
        file_name = re.split(r'[^\\]\/', str(path))[-1]
        print("compressing file")
        file_path = compress(file_name)
        print("sending file to cache channel")
        app.send_audio(CACHECHANNEL, file_path, caption=name)
        os.remove(file_path)
        try:
            os.remove("./iscurrent")
        except Exception as e:
            print("iscurrent not present")
        os._exit(1)
        

if __name__ == '__main__':
    message_id = int(sys.argv[1])
    chat = sys.argv[2].lower()
    name = sys.argv[3]
    main(message_id, chat, name)
