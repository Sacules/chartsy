// @ts-nocheck
// Needed to allow columns to be passed due to the bullshit type it has

import React, { useState, useRef } from "react";
import { Grid, Button } from "semantic-ui-react";
import { useScreenshot } from "use-screenshot-hook";

import { Image } from "./image";
import "./collage.css";

interface Props {
  images: Image[];
}

export const Collage: React.FC<Props> = ({ images }) => {
  const [cols, setCols] = useState(5);
  const [pad, setPad] = useState(7);
  const [showTitle, setShowTitle] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);
  const { image, takeScreenshot, isLoading } = useScreenshot({ ref: divRef });

  return (
    <Grid.Column className="collage-section" width={pad}>
      <Grid verticalAlign="middle" padded>
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
          <Button content="Show Titles" onClick={() => setShowTitle(!showTitle)} />
        </Grid.Column>

        <Grid.Column width={3}>
          <a href={image} download="topsters3.png" target="blank">
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
              <Image image={img} showTitle={showTitle} />
            </Grid.Column>
          ))}
        </Grid>
      </div>
    </Grid.Column>
  );
};
