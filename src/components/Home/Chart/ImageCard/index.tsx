import React, { useState, useContext } from "react";

import { ImagesContext } from "../../../../common/images";
import { Image, SearchType } from "../../../../common/entities";
import { ConfigContext } from "../../../../common/config";

interface Props {
  pos?: number;
  searchType?: SearchType;
  showTitle: boolean;
  img: Image;
}

enum droppedSessionKeys {
  TITLE = "dropped-title",
  URL = "dropped-url",
  AUTHOR = "dropped-author",
}

enum imageSessionKeys {
  TITLE = "image-title",
  URL = "image-url",
  AUTHOR = "image-author",
}

enum typeOfSource {
  RESULTS = "results",
  COLLAGE = "collage",
}

const titleShow = (show: boolean, title: string, author: string | undefined) => {
  if (!show) return "";

  return (
    <figcaption>
      <p>
        <b>{title}</b>
        <br />
        {author}
      </p>
    </figcaption>
  );
};

const ImageCard: React.FC<Props> = ({ pos, searchType, img, showTitle }) => {
  const [title, setTitle] = useState(img.title);
  const [url, setUrl] = useState(img.url);
  const [author, setAuthor] = useState(img.author);

  const { dispatchImages } = useContext(ImagesContext);
  const { config } = useContext(ConfigContext);
  const { imageBig } = config;

  const setImage = (t: string, u: string, a: string) => {
    setTitle(t);
    setUrl(u);
    setAuthor(a);

    if (typeof pos === "undefined") {
      return;
    }

    const img: Image = { author: a, title: t, url: u };
    const i = pos as number;

    dispatchImages({ type: "update", value: { pos: i, img: img } });
  };

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
          sessionStorage.setItem(
            "drag-source",
            parent?.className.includes(typeOfSource.RESULTS) ? typeOfSource.RESULTS : typeOfSource.COLLAGE
          );
          sessionStorage.setItem(imageSessionKeys.TITLE, title);
          sessionStorage.setItem(imageSessionKeys.URL, url);
          sessionStorage.setItem(imageSessionKeys.AUTHOR, author);
        }}
        onDragEnter={(e) => (e.currentTarget.style.opacity = ".5")}
        onDragLeave={(e) => (e.currentTarget.style.opacity = "")}
        onDragOver={(e) => e.preventDefault()}
        onDragEnd={() => {
          if (sessionStorage.getItem("drag-source") === typeOfSource.RESULTS) {
            return;
          }

          const t = sessionStorage.getItem(droppedSessionKeys.TITLE) || "";
          const u = sessionStorage.getItem(droppedSessionKeys.URL) || "";
          const a = sessionStorage.getItem(droppedSessionKeys.AUTHOR) || "";

          if (u) {
            // exchange images
            setImage(t, u, a);
          }
          sessionStorage.clear();
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.style.opacity = "";

          if (sessionStorage.getItem("drag-source") === typeOfSource.COLLAGE) {
            sessionStorage.setItem(droppedSessionKeys.TITLE, title);
            sessionStorage.setItem(droppedSessionKeys.URL, url);
            sessionStorage.setItem(droppedSessionKeys.AUTHOR, author);
          }

          // prevent replacing on results
          const parent = e.currentTarget.parentNode?.parentNode?.parentElement;
          if (parent?.className.includes(typeOfSource.RESULTS)) {
            return;
          }

          const t = sessionStorage.getItem(imageSessionKeys.TITLE) || "";
          const u = sessionStorage.getItem(imageSessionKeys.URL) || "";
          const a = sessionStorage.getItem(imageSessionKeys.AUTHOR) || "";

          if (u) {
            // replace on destination
            setImage(t, u, a);
          }
        }}
        className={`collage-image ${imgclass}`}
        draggable
        src={url}
        alt={author + " - " + title}
      />
      {titleShow(showTitle, title, author)}
    </div>
  );
};

export default ImageCard;
