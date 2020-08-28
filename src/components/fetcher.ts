import { Image } from "./image";
import axios from "axios";

export const getAlbum = async (al: string) => {
  return axios.get("/api/albums?album=" + al.replace(" ", "+")).then((resp) => {
    return resp.data.albums;
  });
};

export const getGame = async (game: string) => {
  return axios.get("/api/games?search=" + game.replace(" ", "+")).then((resp) => {
    let games: Image[] = [];

    for (const g of resp.data.games) {
      games.push({ title: g.title, author: "", url: g.url });
    }

    return games;
  });
};

export const getMovie = async (movie: string) => {
  return axios.get("/api/movies?search=" + movie.replace(" ", "+")).then((resp) => {
    let movies: Image[] = [];

    for (const g of resp.data.movies) {
      movies.push({ title: g.title, author: "", url: g.url });
    }

    return movies;
  });
};

export const getSeries = async (show: string) => {
  return axios.get("/api/series?search=" + show.replace(" ", "+")).then((resp) => {
    let series: Image[] = [];

    for (const g of resp.data.series) {
      series.push({ title: g.title, author: "", url: g.url });
    }

    return series;
  });
};
