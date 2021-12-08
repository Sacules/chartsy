import React from "react";

// Types
import { Image } from "@entities";

interface Props {
  showTitle: boolean;
  img: Image;
}

export const ChartImage: React.FC<Props> = ({ img, showTitle }) => {
  return (
    <figure className="w-24">
      <img
        className="shadow-md"
        src={img.url}
        alt={img.author + " - " + img.title}
      />
      {showTitle && (
        <figcaption className="text-center">
          <p className="text-sm">
            <b>{img.title}</b>
            <br />
            {img.author}
          </p>
        </figcaption>
      )}
    </figure>
  );
};
