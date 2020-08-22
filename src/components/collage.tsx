import React from "react";

import { Image } from "./image";
import "./collage.css";
import { Grid } from "semantic-ui-react";

interface Props {
  images: Image[];
  titleVisible: boolean;
}

export const Collage: React.FC<Props> = ({ images, titleVisible }) => {
  return (
    <Grid className="collage-container" columns={10} padded>
      {images.map((img) => (
        <Grid.Column key={img.url}>
          <Image image={img} showTitle={true} />
        </Grid.Column>
      ))}
    </Grid>
  );
};
