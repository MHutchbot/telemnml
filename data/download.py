from pyrogram import Client

import sys


MINIMAL = -1001394900779
ELECTRO = -1001377388579
BANDCAMP = -1001447176749

app = Client('download')


def main(mid, channel, uid):
    with app:
        if channel == 'minimal':
            cid = MINIMAL
        if channel == 'bandcamp':
            cid = BANDCAMP
        if channel == 'electro':
            cid = ELECTRO
        app.forward_messages(
            chat_id=uid,
            from_chat_id=cid,
            message_ids=[mid],
            as_copy=True
        )


if __name__ == '__main__':
    mid = int(sys.argv[1])
    channel = sys.argv[2].lower()
    uid = int(sys.argv[3])
    main(mid, channel, uid)
