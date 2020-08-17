from flask import Flask, request
from fetcher import LastFM, Rawg
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
    lastfm = LastFM()
    album = request.args.get('album', '')
    return lastfm.search(album)


@app.route("/api/games", methods=['GET'])
def get_games():
    rawg = Rawg()
    game = request.args.get('search', '')
    return rawg.search(game)
