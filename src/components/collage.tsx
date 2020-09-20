// @ts-nocheck
// Needed to allow columns to be passed due to the bullshit type it has

import React, { useState, useRef } from "react";
import { Grid, Button, Menu } from "semantic-ui-react";
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
    <Grid padded>
      <Grid.Column width={pad}>
        <div ref={divRef}>
          <Grid centered vertical padded Align="top" className="collage-container" columns={cols}>
            {images.map((img, i) => (
              <Grid.Column centered key={i}>
                <Image img={img} showTitle={showTitle} />
              </Grid.Column>
            ))}
          </Grid>
        </div>
      </Grid.Column>

      <Grid.Column width={3}>
        <Menu vertical text>
          <Menu.Item>
            <p>
              <b>Rows</b>
            </p>
            <Button content="-" onClick={() => setRows(rows - 1)} />
            <Button content="+" onClick={() => setRows(rows + 1)} />
          </Menu.Item>
          <Menu.Item>
            <p>
              <b>Columns</b>
            </p>
            <Button content="-" onClick={() => setCols(cols - 1)} />
            <Button content="+" onClick={() => setCols(cols + 1)} />
          </Menu.Item>

          <Menu.Item>
            <p>
              <b>Padding </b>
            </p>
            <Button content="-" onClick={() => setPad(pad - 1)} />
            <Button content="+" onClick={() => setPad(pad + 1)} />
          </Menu.Item>

          <Menu.Item>
            <Button content="Show Titles" onClick={() => setShowTitle(!showTitle)} />
          </Menu.Item>

          <Menu.Item>
            <Button
              loading={isLoading}
              onClick={async () => {
                let img = await takeScreenshot("png");
                let link = document.createElement("a");
                link.download = "topsters3.png";
                link.href = img as string;
                link.click();
              }}
            >
              Save to PNG
            </Button>
          </Menu.Item>
        </Menu>
      </Grid.Column>
    </Grid>
  );
};
