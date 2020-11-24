import os
import pathlib
import re
import json

from pyrogram import Client


app = Client("Update")


with app:
    MINIMAL = 'https://t.me/joinchat/AAAAAFMkfyufDjJ6otWIhA'
    ELECTRO = 'https://t.me/joinchat/AAAAAFIZSCNbVxQYDMdYSA'
    BANDCAMP = 'https://t.me/joinchat/AAAAAFZCKi0y6bdGztTWYA'
    TELEMNML = 'https://t.me/joinchat/AAAAAFHj_Wd9Y6WVRXD4EA'
    GENRE_LIST = [MINIMAL, ELECTRO, BANDCAMP]
    MINIMAL_FILE = '../data/minimal.json'
    ELECTRO_FILE = '../data/electro.json'
    BANDCAMP_FILE = '../data/bandcamp.json'
    TELEMNML_FILE = '../data/telemnml.json'
    FILE_LIST = [MINIMAL_FILE, ELECTRO_FILE, BANDCAMP_FILE]
    EP_REGEX = '(\(([0-9]{4},)*.*(Vinyl|CD|File)\))*( \| Edições.*\|*)*( \| Discogs)*( - YYDistribution)*(\([0-9]\))*((\.wav|\.mp3|\.flac|\.zip|\.m3u8).*)*'
    FILE_REGEX = '([0-9]{2}\.)*(\[[A-Z]+[0-9]{2,3}\])*(\.wav|\.mp3|\.flac|\.aiff|\.zip)*((\(|\[)(Master|Vinyl|Web|Digital).*(\]|\)))*'


    for genre, filee in zip(GENRE_LIST, FILE_LIST):
        ep = ''
        counter_ep = 0
        counter_song = 0
        chat = app.get_chat(genre)
        with open(filee) as f:
            data = json.load(f)

        for message in app.iter_history(chat.id, reverse=True):
            if message.caption:
                text = message.caption
            else:
                text = message.text
            try:
                if text:
                    # I link di WeTransfer sono messi due linee sotto il resto
                    split_link = re.split('\n\n', text)
                    text = split_link[0]
                    if len(split_link) > 1:
                        wetransfer_link = split_link[1]
                        data[ep]['download_link'] = wetransfer_link
                    # Download link
                    if ep and re.match('we\.tl|mega\.nz|wetransfer', text):
                        data[ep]['download_link'] = text

                    else:
                        if message.web_page and message.web_page.title:
                            title = message.web_page.title
                        elif message.caption:
                            title = message.caption
                        else:
                            continue
                        # Elimina i dati non necessari
                        title = re.sub(EP_REGEX, '', title)
                        # Alcune volte c'e' una linea secondaria inutile
                        title = re.split('\n', title)[0]
                        # Splitta per ottenere una lista con i dati utili
                        title_list = re.split('-', title)

                        # Setta artist e ep
                        if len(title_list) > 1:
                            artist = title_list[0]
                            ep = title_list[1]
                        elif ', by' in title:
                            ep = re.split(', by', title)[0]
                            artist = re.split(', by', title)[1]
                        else:
                            ep = title_list[0]
                            artist = 'Unknown'

                        # Togli gli spazi inutili
                        while artist[0] == ' ':
                            artist = artist[1:]
                        while artist[-1] == ' ':
                            artist = artist[:-1]
                        while ep[0] == ' ':
                            ep = ep[1:]
                        while ep[-1] == ' ':
                            ep = ep[:-1]

                        # Setta quality
                        if 'master' in text.lower():
                            quality = 'Master'
                        elif 'vinyl' in text.lower():
                            quality = 'Vinyl'
                        elif re.match('web|digital|soundcloud', text.lower()): 
                            quality = 'Web'
                        else:
                            quality = 'Unknown'

                        # Setta cat (catalog)
                        try:
                            cat = re.findall('[A-Z]+[0-9]{2,3}', title)[0]
                        except IndexError:
                            cat = 'Unknown'

                        if 'minimal' in filee:
                            genre_text = 'Minimal'
                        elif 'electro' in filee:
                            genre_text = 'Electro/Others'
                        elif 'bandcamp' in filee:
                            genre_text = 'Bandcamp'
                        data[ep] = {
                            'name': ep,
                            'id': counter_ep,
                            'genre': genre_text,
                            'artist': artist.title(),
                            'quality': quality,
                            'cat': cat 
                    }
                        counter_ep += 1
                        if message.text:
                            data[ep]['link'] = text

                elif ep and (message.document or message.audio):
                    if message.document:
                        file_name = message.document.file_name
                    else:
                        file_name = message.audio.file_name

                    # Elimina i dati inutili dal nome del file
                    if 'files' not in data[ep]:
                        data[ep]['files'] = []
                    file_name = re.sub(FILE_REGEX, '', file_name)

                    artist = data[ep]['artist']
                    try:
                        name = re.split('-', file_name)[1]
                    except IndexError:
                        name = file_name
                    while name[0] == ' ':
                        name = name[1:]
                    while name[-1] == ' ':
                        name = name[:-1]

                    data[ep]['files'].append({
                        'name': name,
                        'id': counter_song,
                        'artist': artist,
                        'ep_id': counter_ep,
                        'genre': genre_text,
                        'message_id': message.message_id
                    })
                    counter_song += 1
            except Exception as e:
                if text:
                    print('ERROR: ' + text)

        with open(filee, 'w') as f:
            json.dump(data, f, indent=4)

    # Telemnml
    chat = app.get_chat(TELEMNML)
    with open(TELEMNML_FILE) as f:
        data = json.load(f)
    counter_song = 0
    for message in app.iter_history(chat.id, reverse=True):
        is_duplicate = False
        try:
            if message.document:
                file_name = message.document.file_name
            elif message.audio:
                file_name = message.audio.file_name
            else:
                continue

            # Elimina i dati inutili dal nome del file
            file_name = re.sub(FILE_REGEX, '', file_name)

            try:
                artist = re.split('-', file_name)[0]
                name = re.split('-', file_name)[1]
            except IndexError:
                name = file_name
            while name[0] == ' ':
                name = name[1:]
            while name[-1] == ' ':
                name = name[:-1]
            while artist[0] == ' ':
                artist = artist[1:]
            while artist[-1] == ' ':
                artist = artist[:-1]

            # Controlla se non e' duplicato negli altri file
            for genre, filee in zip(GENRE_LIST, FILE_LIST):
                with open(filee) as f:
                    filee = json.load(f)
                for ep in filee:
                    if 'files' in filee[ep]:
                        for file in filee[ep]['files']:
                            if artist == file['artist'] and name == file['name']:
                                is_duplicate = True

            if not is_duplicate:
                data[name] = {
                    'name': name,
                    'id': counter_song,
                    'genre': 'Telemnml',
                    'message_id': message.message_id,
                    'artist': artist.title(),
                }
                counter_song += 1
        except Exception as e:
            print('ERROR: ' + file_name)
            print(str(e) + '\n') 

    with open(TELEMNML_FILE, 'w') as f:
        json.dump(data, f, indent=4)
