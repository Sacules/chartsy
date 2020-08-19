import React from "react";

import { Image } from "./image";
import "./collage.css";

interface Props {
  images: Image[];
}

export const onResults = (search: string, images: Image[]) => {
  if (search === "") {
    return "";
  }

  if (search.startsWith("http") || search.endsWith(".jpg") || search.endsWith(".png")) {
    const img: Image = { url: search, author: "", title: "" };
    const images: Image[] = [];
    images.push(img);

    return <SearchResults images={images} />;
  }

  return <SearchResults images={images} />;
};

export const SearchResults: React.FC<Props> = ({ images }) => {
  return (
    <div className="results-container">
      {images.map((img) => (
        <Image key={img.url} image={img} showTitle={true} />
      ))}
    </div>
  );
};
