import React from "react";

// Hooks
import { useChart } from "@contexts/ChartContext";

// Types
import { Image } from "@entities";

interface Props {
  pos: number;
  showTitle: boolean;
  img: Image;
}

export const ChartImage: React.FC<Props> = ({ pos, img, showTitle }) => {
  const { dispatch } = useChart();

  const toggleSearch = () => {
    setTimeout(() => {
      dispatch({ type: "update", field: "showSearch", value: true });
      dispatch({ type: "update", field: "positionReplaced", value: pos });
    }, 100);
  };

  return (
    <figure className="w-24" onTouchEnd={toggleSearch} onClick={toggleSearch}>
      <img
        className="transition-all duration-75 shadow-md hover:border-sky-400 hover:border-4 border border-0"
        src={img.url}
        alt={img.author + " - " + img.title}
      />
      {showTitle && (
        <figcaption className="mt-2 text-center">
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
