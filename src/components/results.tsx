import React from "react";

import { Image } from "./image";
import "./collage.css";

interface Props {
  images: Image[];
}

export const SearchResults: React.FC<Props> = ({ images }) => {
  return (
    <div className="results-container">
      {images.map((img) => (
        <Image key={img.url} image={img} showTitle={true} />
      ))}
    </div>
  );
};
