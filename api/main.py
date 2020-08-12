from flask import Flask, request
from fetcher import LastFM
app = Flask(__name__)


@app.route("/")
def index():
    return "index page"


@app.route("/api/albums", methods=['GET'])
def hello_world():
    lastfm = LastFM()
    album = request.args.get('album', '')
    return lastfm.search(album)
