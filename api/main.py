from flask import Flask, request
from fetcher import LastFM
app = Flask(__name__)


@app.route("/api", methods=['GET'])
def index():
    return { "albums" : [{"album" : "white pony", "artist" : "deftones", "cover" : "https://fanart.tv/fanart/music/7527f6c2-d762-4b88-b5e2-9244f1e34c46/albumcover/white-pony-57f3877012b98.jpg"}]  }


@app.route("/api/albums", methods=['GET'])
def hello_world():
    lastfm = LastFM()
    album = request.args.get('album', '')
    return lastfm.search(album)
