import { Image } from "./image";
import axios from "axios";

export const getAlbum = async (al: string) => {
  return axios.get("/api/albums?album=" + al.replace(" ", "+")).then((resp) => {
    let albums: Image[] = [];

    for (const al of resp.data.albums) {
      albums.push({ title: al.album, author: al.artist, url: al.cover });
    }

    return albums;
  });
};
