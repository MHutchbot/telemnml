import sys

from pyrogram import Client

MINIMAL = -1001394900779
BANDCAMP = -1001447176749
ELECTRO = -1001377388579


app = Client('get_link')


def get_chat_id(channel):
    if channel == 'minimal':
        return MINIMAL
    elif channel == 'bandcamp':
        return BANDCAMP
    elif channel == 'electro':
        return ELECTRO


def main(channel, message_id):
    chat_id = get_chat_id(channel)
    with app:
        app.forward_messages(
            chat_id='filetolinkvn_bot',
            from_chat_id=chat_id,
            message_ids=[message_id]
        )


if __name__ == '__main__':
    channel = sys.argv[1].lower()
    message_id = int(sys.argv[2])
    main(channel, message_id)
