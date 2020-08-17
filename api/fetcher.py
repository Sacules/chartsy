"""Defines and implements the interface for the several search providers"""

from typing import Dict, Any, List
import abc
import os
import requests

SearchResults = Dict[str, List[Any]]


class Searcher(metaclass=abc.ABCMeta):
    """
    Searcher defines the interface for which all searches implement
    regardless of provider.
    """

    @classmethod
    def __subclasshook__(cls, subclass):
        return (callable(subclass.search)
                if hasattr(subclass, 'search')
                else NotImplemented)

    @abc.abstractmethod
    def search(self, searchterm: str) -> SearchResults:
        """Searches the given term in a certain provider

        :returns: An array of results

        """
        raise NotImplementedError()


class LastFM:
    """Searches for album covers on Last.fm"""

    def __init__(self):
        self.api_url = "http://ws.audioscrobbler.com/2.0/"
        self.api_key = os.environ["LASTFM_KEY"]
        self.user_agent = "topsters"

    def lookup(self, payload: dict) -> Dict[Any, Any]:
        headers = {'user-agent': self.user_agent}

        payload['api_key'] = self.api_key
        payload['format'] = 'json'

        req = requests.get(self.api_url, headers=headers, params=payload)
        if req.status_code != 200:
            return {}

        return req.json()

    def search(self, searchterm: str) -> SearchResults:
        """
        Searches the given term on the LastFM database and returns
        the album covers.
        """
        results = self.lookup({'method': 'album.search', 'album': searchterm})
        if results is None:
            return {}

        album_matches = results.get('results', {}).get(
            'albummatches', {}).get('album', [])
        # album_matches = results['results']['albummatches']['album']
        albums = []

        for album in album_matches:
            # Only get small images
            cover = album['image'][2]['#text']
            if cover == "":
                continue

            albums.append(
                {'artist': album['artist'], 'album': album['name'], 'cover': cover})

        return {'albums': albums}


class Rawg:
    """Searches for video game artworks on RAWG.io"""

    def __init__(self):
        self.api_url = "https://api.rawg.io/api/games"
        self.user_agent = "topsters"

    def search(self, searchterm: str) -> SearchResults:
        """
        Searches the given term on the RAWG.io database and returns
        the games covers.
        """
        head = {'user-agent': self.user_agent}

        req = requests.get(self.api_url + "?search=" +
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
