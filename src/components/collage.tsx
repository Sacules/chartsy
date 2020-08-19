import React from "react";

import { Image } from "./image";
import "./collage.css";

interface Props {
  images: Image[];
  titleVisible: boolean;
}

export const Collage: React.FC<Props> = ({ images, titleVisible }) => {
  return (
    <div className="collage-container">
      {images.map((img) => (
        <Image key={img.url} image={img} showTitle={titleVisible} />
      ))}
    </div>
  );
};
