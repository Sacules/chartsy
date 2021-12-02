import axios from "axios";

import { Image } from "../entities";

const APIURL = "https://api.chartsy.net";

const http = axios.create({
  baseURL: APIURL,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
});

export const getMusic = async (search: string) => {
  return http.get("/albums?search=" + search.replace(" ", "+")).then((resp) => {
    return resp.data.albums;
  });
};
