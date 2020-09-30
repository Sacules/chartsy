import React from "react";

import { Image } from "./images";
import { ImageCard } from "./image";
import "./collage.css";
import { Grid } from "semantic-ui-react";

interface Props {
  images: Image[];
}

export const onResults = (search: string, images: Image[]) => {
  if (search === "") {
    return "";
  }

  if (search.startsWith("http") || search.endsWith(".jpg") || search.endsWith(".png")) {
    const img: Image = { url: search, author: "", title: "" };
    const images: Image[] = [];
    images.push(img);

    return <SearchResults images={images} />;
  }

  return <SearchResults images={images} />;
};

export const SearchResults: React.FC<Props> = ({ images }) => {
  return (
    <Grid className="results" centered padded>
      {images.map((img) => (
        <Grid.Row>
          <ImageCard key={img.url} img={img} showTitle={true} />
        </Grid.Row>
      ))}
    </Grid>
  );
};
