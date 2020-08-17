"""Defines and implements the several search providers"""

from typing import Dict, Any, List
import os
import requests

SearchResults = Dict[str, List[Any]]


def lastfm(searchterm: str) -> SearchResults:
    """Searches for album covers on Last.fm"""

    api_url = "http://ws.audioscrobbler.com/2.0/"
    api_key = os.environ["LASTFM_KEY"]
    user_agent = "topsters"

    headers = {'user-agent': user_agent}
    payload = {'method': 'album.search', 'album': searchterm}

    payload['api_key'] = api_key
    payload['format'] = 'json'

    req = requests.get(api_url, headers=headers, params=payload)
    if req.status_code != 200:
        return {}

    results = req.json()
    if results is None:
        return {}

    album_matches = results.get('results', {}).get(
        'albummatches', {}).get('album', [])
    albums = []

    for album in album_matches:
        # Only get small images
        cover = album.get('image', [])[2].get('#text', "")
        if cover == "":
            continue

        albums.append(
            {'artist': album['artist'], 'album': album['name'], 'cover': cover})

    return {'albums': albums}


def rawg(searchterm: str) -> SearchResults:
    """Searches for video game artworks on RAWG.io"""

    api_url = "https://api.rawg.io/api/games"
    user_agent = "topsters"
    head = {'user-agent': user_agent}

    req = requests.get(api_url + "?search=" +
                       searchterm, headers=head)
    if req.status_code != 200:
        return {}

    resp = req.json()
    results = resp['results']

    games = []
    for game in results:
        games.append(
            {'title': game['name'], 'url': game['background_image']})

    return {'games': games}
