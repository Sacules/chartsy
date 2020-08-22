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
  image: Image;
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

export const Image: React.FC<ImageProps> = ({ image, showTitle }) => {
  let [title, setTitle] = useState(image.title);
  let [url, setUrl] = useState(image.url);
  let [author, setAuthor] = useState(image.author);

  return (
    <div>
      <img
        onDragStart={(e) => {
          const parent = e.currentTarget.parentNode?.parentNode?.parentElement;
          if (parent?.className.includes("results")) {
            e.dataTransfer.setData("drag-source", "results");
          } else {
            e.dataTransfer.setData("drag-source", "collage");
          }

          e.dataTransfer.setData("image-title", title);
          e.dataTransfer.setData("image-url", url);
          e.dataTransfer.setData("image-author", author);
        }}
        onDragEnter={(e) => (e.currentTarget.style.opacity = ".5")}
        onDragLeave={(e) => (e.currentTarget.style.opacity = "")}
        onDragOver={(e) => e.preventDefault()}
        onDragEnd={(e) => {
          if (e.dataTransfer.getData("drag-source") === "results") {
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

          if (e.dataTransfer.getData("drag-source") === "collage") {
            sessionStorage.setItem("dropped-title", title);
            sessionStorage.setItem("dropped-url", url);
            sessionStorage.setItem("dropped-author", author);
          }

          setTitle(e.dataTransfer.getData("image-title"));
          setUrl(e.dataTransfer.getData("image-url"));
          setAuthor(e.dataTransfer.getData("image-author"));
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
