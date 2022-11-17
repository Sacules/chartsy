import useFetch from "react-fetch-hook";

const APIURL = "https://api.chartsy.net";

export const getMusic = async (search: string) =>
  useFetch(APIURL + "/albums?search=" + search.replace(" ", "+"), {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
