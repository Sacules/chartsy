import React, { useState } from "react";
import { Collage } from "./Collage";
import { Image } from "./Image";
import { Search } from "./Search";

const defaultImage: Image = {
  title: "A Nisman",
  author: "Lo Mataron",
  url: "https://i.imgur.com/w4toMiR.jpg",
};

export const Home: React.FC = () => {
  const [images, setImages] = useState(50);
  const [search, setSearch] = useState("");

  const defaultImages: Image[] = [];
  for (let i = 0; i < images; i++) {
    defaultImages.push(defaultImage);
  }

  return (
    <div>
      <Search setSearch={setSearch} />
      <Collage images={defaultImages} titleVisible={true} />
    </div>
  );
};
