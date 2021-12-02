import React from "react";

// Types
import { Image } from "@entities";

interface Props {
  pos?: number;
  showTitle: boolean;
  img: Image;
  onGrid: boolean;
}

export const ChartImage: React.FC<Props> = ({
  pos,
  img,
  showTitle,
  onGrid,
}) => {
  return (
    <figure>
      <img
        draggable
        className=""
        src={img.url}
        alt={img.author + " - " + img.title}
      />
      {showTitle && (
        <figcaption>
          <p>
            <b>{img.title}</b>
            <br />
            {img.author}
          </p>
        </figcaption>
      )}
    </figure>
  );
};
