// @ts-nocheck
// Needed to allow columns to be passed due to the bullshit type it has

import React, { useRef } from "react";
import { Grid, Button } from "semantic-ui-react";
import { useScreenshot } from "use-screenshot-hook";

import { Image } from "./image";
import "./collage.css";

interface Props {
  pad: number;
  setPad: (pad: number) => void;
  cols: number;
  setCols: (cols: number) => void;
  images: Image[];
  setTitleVisible: (titleVisible: boolean) => void;
  titleVisible: boolean;
}

export const Collage: React.FC<Props> = ({ pad, setPad, setCols, cols, images, titleVisible, setTitleVisible }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const { image, takeScreenshot, isLoading } = useScreenshot({ ref: divRef });

  return (
    <div className="collage-section">
      <Grid verticalAlign="middle" padded="very">
        <Grid.Column width={4}>
          <p>
            <b>Columns</b>
          </p>
          <Button content="-" onClick={() => setCols(cols - 1)} />
          <Button content="+" onClick={() => setCols(cols + 1)} />
        </Grid.Column>

        <Grid.Column width={4}>
          <p>
            <b>Padding </b>
          </p>
          <Button content="-" onClick={() => setPad(pad - 1)} />
          <Button content="+" onClick={() => setPad(pad + 1)} />
        </Grid.Column>

        <Grid.Column width={3}>
          <Button content="Show Titles" onClick={() => setTitleVisible(!titleVisible)} />
        </Grid.Column>

        <Grid.Column width={3}>
          <a href={image} download="topsters3.png" onChange={(e) => e.currentTarget.click()} target="blank">
            <Button loading={isLoading} onClick={() => takeScreenshot("png")}>
              Save to PNG
            </Button>
          </a>
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
