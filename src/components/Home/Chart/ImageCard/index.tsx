import React from "react";

import { useImageGrid } from "../../../../common/imagegrid";
import { Image, SearchType } from "../../../../common/entities";
import { useConfig } from "../../../../common/config";

interface Props {
  pos?: number;
  searchType?: SearchType;
  showTitle: boolean;
  img: Image;
}

const ImageCard: React.FC<Props> = ({ pos, searchType, img, showTitle }) => {
  const {
    imageGrid: { draggedSource, draggedTarget },
    dispatch,
  } = useImageGrid();
  const {
    config: { imageBig },
  } = useConfig();

  let imgclass = "";
  if (searchType === SearchType.Movies || searchType === SearchType.Series) {
    imgclass = "film";
  }

  if (searchType === SearchType.Games) {
    imgclass = "game";
  }

  if (imageBig) {
    imgclass += " album-big";
  }

  return (
    <div>
      <img
        onDragStart={(e) => {
          const parent = e.currentTarget.parentNode?.parentNode?.parentElement;
          if (parent?.className.includes("results")) {
            dispatch({ type: "update", field: "draggedSource", value: "results" });
            dispatch({ type: "update", field: "draggedImage", value: img });
          } else {
            dispatch({ type: "update", field: "draggedSource", value: "collage" });
            dispatch({ type: "update", field: "positionDragged", value: pos });
            dispatch({ type: "update", field: "positionTarget", value: pos });
          }
        }}
        onDragEnter={(e) => (e.currentTarget.style.opacity = ".5")}
        onDragLeave={(e) => (e.currentTarget.style.opacity = "")}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.style.opacity = "";

          // prevent replacing on results
          const parent = e.currentTarget.parentNode?.parentNode?.parentElement;
          const onResults = parent?.className.includes("results");
          if (onResults) {
            dispatch({ type: "update", field: "draggedTarget", value: "results" });
            return;
          }

          dispatch({ type: "update", field: "draggedTarget", value: "collage" });
          dispatch({ type: "update", field: "positionTarget", value: pos });
        }}
        onDragEnd={() => {
          if (draggedTarget === "results") {
            return;
          }

          if (draggedSource === "results") {
            dispatch({ type: "replace" });
          } else {
            dispatch({ type: "exchange" });
          }
        }}
        draggable
        className={`collage-image ${imgclass}`}
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
    </div>
  );
};

export default ImageCard;
