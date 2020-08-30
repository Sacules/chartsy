// @ts-nocheck
// Needed to allow columns to be passed due to the bullshit type it has

import React, { useState, useRef } from "react";
import { Grid, Button } from "semantic-ui-react";
import { useScreenshot } from "use-screenshot-hook";

import { Image, defaultImage } from "./image";
import "./collage.css";

export const Collage: React.FC = () => {
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);
  const [pad, setPad] = useState(7);
  const [showTitle, setShowTitle] = useState(false);

  let defaultImages = () => {
    let imgs: Image[] = [];
    for (let i = 0; i < rows * cols; i++) {
      imgs.push(defaultImage);
    }

    return imgs;
  };

  let images = defaultImages();
  const divRef = useRef<HTMLDivElement>(null);

  const { takeScreenshot, isLoading } = useScreenshot({ ref: divRef });

  return (
    <Grid.Column className="collage-section" width={pad}>
      <Grid verticalAlign="middle" padded>
        <Grid.Column width={4}>
          <p>
            <b>Rows</b>
          </p>
          <Button content="-" onClick={() => setRows(rows - 1)} />
          <Button content="+" onClick={() => setRows(rows + 1)} />
        </Grid.Column>
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
          <Button
            loading={isLoading}
            onClick={async () => {
              let img = await takeScreenshot("png");
              let link = document.createElement("a");
              link.download = "topsters3.png";
              link.href = img;
              link.click();
            }}
          >
            Save to PNG
          </Button>
        </Grid.Column>
      </Grid>

      <div ref={divRef}>
        <Grid verticalAlign="top" className="collage-container" columns={cols} padded>
          {images.map((img, i) => (
            <Grid.Column centered key={i}>
              <Image img={img} showTitle={showTitle} />
            </Grid.Column>
          ))}
        </Grid>
      </div>
    </Grid.Column>
  );
};
