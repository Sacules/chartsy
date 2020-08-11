"""Defines and implements the interface for the several search providers"""

from typing import Dict, Any, List
import abc
import json
import os
import requests

SearchResults = List[Dict[Any, Any]]


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

    def lookup(self, payload: dict) -> SearchResults:
        headers = {'user-agent': self.user_agent}

        payload['api_key'] = self.api_key
        payload['format'] = 'json'

        req = requests.get(self.api_url, headers=headers, params=payload)
        if req.status_code != 200:
            return None

        return req.json()

    def search(self, searchterm: str) -> SearchResults:
        """
        Searches the given term on the LastFM database and returns
        the album covers.
        """
        results = self.lookup({'method': 'album.search', 'album': searchterm})
        if results is None:
            return None

        album_matches = results['results']['albummatches']['album']
        albums = []

        for al in album_matches:
            cover = al['image'][0]['#text']
            if cover == "":
                continue

            # Only get small images
            albums.append(
                {'artist': al['artist'], 'album': al['name'], 'cover': cover})

        return {'albums': albums}


def main():
    l = LastFM()
    r = l.search("dark side of the moon")
    text = json.dumps(r, sort_keys=True, indent=4)
    print(text)


if __name__ == "__main__":
    main()
