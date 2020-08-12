import React from "react";
import { Collage } from "./Collage";
import { Image } from "./Image";

export const records: Image[] = [
  {
    title: "RTJ4",
    author: "Run the Jewels",
    url: "https://fanart.tv/fanart/music/a80c5dc5-b12e-4667-9f5a-b568961f3839/albumcover/rtj4-5ed7ff27eeba8.jpg",
  },
  {
    title: "RTJ3",
    author: "Run the Jewels",
    url: "https://fanart.tv/fanart/music/a80c5dc5-b12e-4667-9f5a-b568961f3839/albumcover/rtj3-5ee37e682ef48.jpg",
  },
  {
    title: "RTJ2",
    author: "Run the Jewels",
    url:
      "https://fanart.tv/fanart/music/a80c5dc5-b12e-4667-9f5a-b568961f3839/albumcover/run-the-jewels-2-5edaf48ca7934.jpg",
  },
  {
    title: "RTJ",
    author: "Run the Jewels",
    url:
      "https://fanart.tv/fanart/music/a80c5dc5-b12e-4667-9f5a-b568961f3839/albumcover/run-the-jewels-536f202805757.jpg",
  },
  {
    title: "Dummy",
    author: "Portishead",
    url: "https://fanart.tv/fanart/music/8f6bd1e4-fbe1-4f50-aa9b-94c450ec0f11/albumcover/dummy-55c4c4e6af3a3.jpg",
  },
  {
    title: "Portishead",
    author: "Portishead",
    url: "https://fanart.tv/fanart/music/8f6bd1e4-fbe1-4f50-aa9b-94c450ec0f11/albumcover/portishead-55c4c4f2ce8ab.jpg",
  },
  {
    title: "Third",
    author: "Portishead",
    url: "https://fanart.tv/fanart/music/8f6bd1e4-fbe1-4f50-aa9b-94c450ec0f11/albumcover/third-559d7eed760f1.jpg",
  },
  {
    title: "Arca",
    author: "Arca",
    url: "https://fanart.tv/fanart/music/f7625f34-1799-42a4-a1c6-22b5377c767b/albumcover/arca-5c744e7000dd8.jpg",
  },
  {
    title: "Mezzanine",
    author: "Massive Attack",
    url: "https://fanart.tv/fanart/music/10adbe5e-a2c0-4bf3-8249-2b4cbf6e6ca8/albumcover/mezzanine-558951502d6e5.jpg",
  },
  {
    title: "Sirens",
    author: "Nicolas Jaar",
    url: "https://f4.bcbits.com/img/a1554562966_10.jpg",
  },
];

export const Home: React.FC = () => {
  return <Collage images={records} titleVisible={true} />;
};
