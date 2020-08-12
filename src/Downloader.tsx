import React from "react";
import axios from "axios";

interface Props {
  search: string;
}

/* export const Downloader: React.FC<Props> = ({ search }) => { */
/*   const getAlbum = (al: string) => { */
/*     let albums: Image[] = []; */
/*     axios.get("/api/albums?album=" + al).then((resp) => { */
/*       for (const al of resp.data.albums) { */
/*         albums.push({ title: al.album, author: al.artist, url: al.cover }); */
/*       } */
/*     }); */

/*     return albums; */
/*   }; */
/* }; */
