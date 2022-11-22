import useFetch from "react-fetch-hook";

const APIURL = "https://api.chartsy.net";

export const getMusic = async (search: string) =>
  fetch(APIURL + "/albums?search=" + search.replace(" ", "+"), {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
