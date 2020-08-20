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
      <figure>
        <img
          onDragStart={(e) => {
            e.dataTransfer.setData("image-title", title);
            e.dataTransfer.setData("image-url", url);
            e.dataTransfer.setData("image-author", author);
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            setUrl(e.dataTransfer.getData("image-url"));
            setTitle(e.dataTransfer.getData("image-title"));
            setAuthor(e.dataTransfer.getData("image-author"));
            e.preventDefault();
          }}
          className="collage-image"
          draggable
          src={url}
          alt={author + " - " + title}
        />
        {titleShow(showTitle, title, author)}
      </figure>
    </div>
  );
};
