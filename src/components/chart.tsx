// @ts-nocheck
// Needed to allow columns to be passed due to the bullshit type it has

import React, { useState, useRef, useContext } from "react";
import { Grid } from "semantic-ui-react";
import { useScreenshot } from "use-screenshot-hook";

import { Image, defaultImage } from "./image";
import { ChartType, ConfigContext } from "./config";

import "./collage.css";

let defaultImages = (rows: number, cols: number) => {
  let imgs: Image[] = [];
  for (let i = 0; i < rows * cols; i++) {
    imgs.push(defaultImage);
  }

  return imgs;
};

const collage = (images: Image[], cols: number, showTitles: boolean) => {
  return (
    <Grid textAlign="left" centered vertical padded columns={cols}>
      {images.map((img, i) => (
        <Grid.Column centered key={i}>
          <Image img={img} showTitle={showTitles} />
        </Grid.Column>
      ))}
    </Grid>
  );
};

export const Chart: React.FC = () => {
  const { state } = useContext(ConfigContext);
  const { rows, cols, showTitles, addTitle, chartType } = state;

  let images = defaultImages(rows, cols);
  const divRef = useRef<HTMLDivElement>(null);

  const { takeScreenshot, isLoading } = useScreenshot({ ref: divRef });

  const title = () => {
    if (!addTitle) {
      return "";
    }

    return <h1 contentEditable>Title</h1>;
  };

  const top50 = () => {
    return collage(images, cols, showTitles);
  };

  const chart = () => {
    if (chartType === ChartType.Collage) {
      return collage(images, cols, showTitles);
    }

    return top50();
  };

  return (
    <div ref={divRef} className="collage-container">
      {title()}
      {chart()}
    </div>
  );
};
