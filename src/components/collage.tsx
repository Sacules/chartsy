// @ts-nocheck
// Needed to allow columns to be passed due to the bullshit type it has

import React, { useRef } from "react";
import { Grid, Button } from "semantic-ui-react";
import { useScreenshot } from "use-screenshot-hook";

import { Image } from "./image";
import "./collage.css";

interface Props {
  cols: number;
  setCols: (cols: number) => void;
  images: Image[];
  titleVisible: boolean;
}

export const Collage: React.FC<Props> = ({ setCols, cols, images, titleVisible }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const { image, takeScreenshot, isLoading } = useScreenshot({ ref: divRef });

  return (
    <div className="collage-section">
      <Grid padded="very">
        <Grid.Column width={4}>
          <a href={image} download="topsters3.png" onChange={(e) => e.currentTarget.click()} target="blank">
            <Button loading={isLoading} onClick={() => takeScreenshot("png")}>
              Save to PNG
            </Button>
          </a>
        </Grid.Column>

        <Grid.Column width={4}>
          <p>
            <b>Columns </b>
            {cols}
          </p>
          <Button content="-" onClick={() => setCols(cols - 1)} />
          <Button content="+" onClick={() => setCols(cols + 1)} />
        </Grid.Column>
      </Grid>

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
