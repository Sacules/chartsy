import { Image } from "./Image";
import axios from "axios";

export const getAlbum = async (al: string) => {
  let albums: Image[] = [];
  axios
    .get("/api")
    .then((resp) => {
      for (const al of resp.data.albums) {
        albums.push({ title: al.album, author: al.artist, url: al.cover });
      }

      return albums;
    })
    .catch((err) => {
      alert(err);
      console.log(err);
    });

  return albums;
};
