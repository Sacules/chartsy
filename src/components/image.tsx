import React, { useState, useContext } from "react";

import { Image, ImagesContext } from "./images";
import { SearchType } from "./search";

interface Props {
  pos?: number;
  searchType?: SearchType;
  showTitle: boolean;
  img: Image;
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

export const ImageCard: React.FC<Props> = ({ pos, searchType, img, showTitle }) => {
  const [title, setTitle] = useState(img.title);
  const [url, setUrl] = useState(img.url);
  const [author, setAuthor] = useState(img.author);
  const { dispatchImages } = useContext(ImagesContext);

  let n = "";
  if (searchType === SearchType.Movies || searchType === SearchType.Series) {
    n = "film";
  }

  return (
    <div>
      <img
        onDragStart={(e) => {
          const parent = e.currentTarget.parentNode?.parentNode?.parentElement;
          if (parent?.className.includes("results")) {
            sessionStorage.setItem("drag-source", "results");
          } else {
            sessionStorage.setItem("drag-source", "collage");
          }

          sessionStorage.setItem("image-title", title);
          sessionStorage.setItem("image-url", url);
          sessionStorage.setItem("image-author", author);
        }}
        onDragEnter={(e) => (e.currentTarget.style.opacity = ".5")}
        onDragLeave={(e) => (e.currentTarget.style.opacity = "")}
        onDragOver={(e) => e.preventDefault()}
        onDragEnd={() => {
          if (sessionStorage.getItem("drag-source") === "results") {
            return;
          }

          // exchange images
          const t = sessionStorage.getItem("dropped-title") as string;
          const u = sessionStorage.getItem("dropped-url") as string;
          const a = sessionStorage.getItem("dropped-author") as string;

          setTitle(t);
          setUrl(u);
          setAuthor(a);

          if (typeof pos === "undefined") {
            return;
          }

          const img: Image = { author: a, title: t, url: u };
          const i = pos as number;

          dispatchImages({ type: "update", value: { pos: i, img: img } });

          sessionStorage.clear();
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.style.opacity = "";

          if (sessionStorage.getItem("drag-source") === "collage") {
            sessionStorage.setItem("dropped-title", title);
            sessionStorage.setItem("dropped-url", url);
            sessionStorage.setItem("dropped-author", author);
          }

          // prevent replacing on results
          const parent = e.currentTarget.parentNode?.parentNode?.parentElement;
          if (parent?.className.includes("results")) {
            return;
          }

          const t = sessionStorage.getItem("image-title") as string;
          const u = sessionStorage.getItem("image-url") as string;
          const a = sessionStorage.getItem("image-author") as string;

          // replace on destination
          setTitle(t);
          setUrl(u);
          setAuthor(a);

          if (typeof pos === "undefined") {
            return;
          }

          const img: Image = { author: a, title: t, url: u };
          const i = pos as number;

          dispatchImages({ type: "update", value: { pos: i, img: img } });
        }}
        className={`collage-image ${n}`}
        draggable
        src={url}
        alt={author + " - " + title}
      />
      {titleShow(showTitle, title, author)}
    </div>
  );
};
