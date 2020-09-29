// Needed to allow columns to be passed due to the bullshit type it has

import React, { useRef, useContext } from "react";
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

const collage = (images: Image[], rows: number, cols: number, showTitles: boolean, addTitle: boolean) => {
  var matrix: Image[][] = [];
  var n = 0;
  for (let i = 0; i < rows; i++) {
    let row: Image[] = new Array(cols);
    matrix.push(row);
    for (let j = 0; j < cols; j++) {
      matrix[i][j] = images[n];
      n++;
    }
  }

  const title = () => {
    if (!addTitle) {
      return "";
    }

    return (
      <caption contentEditable>
        <h1>Title</h1>
      </caption>
    );
  };

  return (
    <table>
      {title()}
      {matrix.map((row) => (
        <tr>
          {row.map((img) => (
            <td>
              <Image img={img} showTitle={showTitles} />
            </td>
          ))}
        </tr>
      ))}
    </table>
  );
};

export const Chart: React.FC = () => {
  const { state } = useContext(ConfigContext);
  const { rows, cols, showTitles, addTitle, chartType } = state;

  let images = defaultImages(rows, cols);
  const divRef = useRef<HTMLDivElement>(null);

  const { takeScreenshot, isLoading } = useScreenshot({ ref: divRef });

  const top50 = () => {
    return collage(images, rows, cols, showTitles, addTitle);
  };

  const chart = () => {
    if (chartType === ChartType.Collage) {
      return collage(images, rows, cols, showTitles, addTitle);
    }

    return top50();
  };

  return (
    <div ref={divRef} className="collage-container">
      {chart()}
    </div>
  );
};
