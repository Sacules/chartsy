// @ts-nocheck
// Needed to allow columns to be passed due to the bullshit type it has

import React, { useRef } from "react";
import { Grid, Button } from "semantic-ui-react";
import { useScreenshot } from "use-screenshot-hook";

import { Image } from "./image";
import "./collage.css";

interface Props {
  cols: number;
  images: Image[];
  titleVisible: boolean;
}

export const Collage: React.FC<Props> = ({ cols, images, titleVisible }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const { image, takeScreenshot, isLoading } = useScreenshot({ ref: divRef });
  return (
    <div>
      <a href={image} onClick={(e) => e.currentTarget.click()} target="blank">
        <Button loading={isLoading} onClick={() => takeScreenshot("png")} content="click" />
      </a>
      <div ref={divRef}>
        <Grid className="collage-container" columns={cols} padded>
          {images.map((img) => (
            <Grid.Column centered key={img.url}>
              <Image image={img} showTitle={titleVisible} />
            </Grid.Column>
          ))}
        </Grid>
      </div>
    </div>
  );
};
