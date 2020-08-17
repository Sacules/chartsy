from flask import Flask, request
from fetcher import search_lastfm, search_rawg
app = Flask(__name__)


@app.route("/api", methods=['GET'])
def index():
    return {
        "albums": [
            {
                "album": "white pony",
                "artist": "deftones",
                "cover": "https://i.imgur.com/K58Reyy.jpg"
            }
        ]
    }


@app.route("/api/albums", methods=['GET'])
def get_albums():
    album = request.args.get('album', '')
    return search_lastfm(album)


@app.route("/api/games", methods=['GET'])
def get_games():
    game = request.args.get('search', '')
    return search_rawg(game)
