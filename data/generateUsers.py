import sys
import requests

from pyrogram import Client


TELEMNML = -1001373896039
f = open("users.txt", "w")

def main(username):
    writingString = ""
    app = Client('registration')
    with app:
        for member in app.iter_chat_members(TELEMNML, filter='recent'):
            writingString += str(member["user"]["id"]) + "\n"
    f.write(writingString)

if __name__ == '__main__':
    if len(sys.argv) == 2:
        username = sys.argv[1]
        main(username)
    else:
        raise Exception("The username is missing.")
