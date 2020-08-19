import React, { useState } from "react";

export type Image = {
  title: string;
  author?: string;
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

export const titleShow = (show: boolean, title: string, author: string | undefined) => {
  if (!show) return "";

  return (
    <figcaption>
      <p>
        <div className="image-title">
          <b>{title}</b>
        </div>
        <br />
        <div className="image-author">{author}</div>
      </p>
    </figcaption>
  );
};

export const Image: React.FC<ImageProps> = ({ image, showTitle }) => {
  let [title, setTitle] = useState(image.title);
  let [url, setUrl] = useState(image.url);
  const { author } = image;

  return (
    <div>
      <figure>
        <img
          onDragStart={(e) => {
            e.dataTransfer.setData("image-title", title);
            e.dataTransfer.setData("image-url", url);
            // e.dataTransfer.setData("image-author", author);
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            setUrl(e.dataTransfer.getData("image-url"));
            setTitle(e.dataTransfer.getData("image-title"));
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
