import axios from "axios";

import { Image } from "../common/entities";

const APIURL = "https://api.chartsy.net";

const http = axios.create({
  baseURL: APIURL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

export const getAlbum = async (al: string) => {
  return http.get("/albums?search=" + al.replace(" ", "+")).then((resp) => {
    return resp.data.albums;
  });
};

export const getGame = async (game: string) => {
  return http.get("/games?search=" + game.replace(" ", "+")).then((resp) => {
    let games: Image[] = [];

    for (const g of resp.data.games) {
      games.push({ title: g.title, author: "", url: g.url });
    }

    return games;
  });
};

export const getMovie = async (movie: string) => {
  return http.get("/movies?search=" + movie.replace(" ", "+")).then((resp) => {
    let movies: Image[] = [];

    for (const g of resp.data.movies) {
      movies.push({ title: g.title, author: "", url: g.url });
    }

    return movies;
  });
};

export const getSeries = async (show: string) => {
  return http.get("/series?search=" + show.replace(" ", "+")).then((resp) => {
    let series: Image[] = [];

    for (const g of resp.data.series) {
      series.push({ title: g.title, author: "", url: g.url });
    }

    return series;
  });
};
