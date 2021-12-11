import React from "react";

// Types
import { Image } from "@entities";

interface Props {
  pos: number;
  showTitle: boolean;
  img: Image;
}

export const ChartImage: React.FC<Props> = ({ pos, img, showTitle }) => {
  const showSearch = () => {};

  return (
    <figure className="w-24" onTouchEnd={showSearch} onClick={showSearch}>
      <img
        className="transition-all shadow-md hover:outline-sky-400 outline outline-transparent"
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
