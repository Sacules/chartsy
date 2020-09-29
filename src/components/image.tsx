import React, { useState } from "react";

export type Image = {
  title: string;
  author: string;
  url: string;
};

export const defaultImage: Image = {
  title: "",
  author: "",
  url: "https://i.imgur.com/w4toMiR.jpg",
};

interface ImageProps {
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

export const Image: React.FC<ImageProps> = ({ img, showTitle }) => {
  let [title, setTitle] = useState(img.title);
  let [url, setUrl] = useState(img.url);
  let [author, setAuthor] = useState(img.author);

  return (
    <div className="image">
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
        onDragEnd={(e) => {
          if (sessionStorage.getItem("drag-source") === "results") {
            return;
          }

          setTitle(sessionStorage.getItem("dropped-title") as string);
          setUrl(sessionStorage.getItem("dropped-url") as string);
          setAuthor(sessionStorage.getItem("dropped-author") as string);

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

          setTitle(sessionStorage.getItem("image-title") as string);
          setUrl(sessionStorage.getItem("image-url") as string);
          setAuthor(sessionStorage.getItem("image-author") as string);
        }}
        className="collage-image"
        draggable
        src={url}
        alt={author + " - " + title}
      />
      {titleShow(showTitle, title, author)}
    </div>
  );
};
