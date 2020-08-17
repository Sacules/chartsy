import React from "react";

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

export const createRow = (row: Image[], titleVisible: boolean) => {
  return (
    <Grid.Row className="collage-row">
      {row.map((img) => (
        <Grid.Column key={img.url}>
          <Image key={img.url} image={img} showTitle={titleVisible} />
        </Grid.Column>
      ))}
    </Grid.Row>
  );
};
