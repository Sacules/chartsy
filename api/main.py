""" Main module """

from flask import Flask, request
import search
app = Flask(__name__)


@app.route("/api", methods=['GET'])
def index():
    """ Dummy endpoint, only for testing"""
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
    """ Route for the albums """
    album = request.args.get('album', '')
    return search.lastfm(album)


@app.route("/api/games", methods=['GET'])
def get_games():
    """ Route for the games """
    game = request.args.get('search', '')
    return search.rawg(game)


@app.route("/api/movies", methods=['GET'])
def get_movies():
    """ Route for the games """
    movie = request.args.get('search', '')
    return search.imdb_movies(movie)


@app.route("/api/series", methods=['GET'])
def get_series():
    """ Route for the games """
    show = request.args.get('search', '')
    return search.imdb_series(show)
