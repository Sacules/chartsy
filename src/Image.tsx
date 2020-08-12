import React from "react";

export type Image = {
  title: string;
  author: string;
  url: string;
};

interface ImageProps {
  showTitle: boolean;
  image: Image;
}

export const Image: React.FC<ImageProps> = ({ image, showTitle }) => {
  const { title, author, url } = image;

  const titleShow = (show: boolean) => {
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

  return (
    <div className="collage-image">
      <figure>
        <img src={url} alt={author + " - " + title} />
        <div>{titleShow(showTitle)}</div>
      </figure>
    </div>
  );
};
