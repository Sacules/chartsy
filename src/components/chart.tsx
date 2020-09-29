// Needed to allow columns to be passed due to the bullshit type it has

import React, { useContext } from "react";

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

const collage = (
  images: Image[],
  rows: number,
  cols: number,
  pad: number,
  showTitles: boolean,
  addTitle: boolean,
  tableRef: React.RefObject<HTMLTableElement>
) => {
  // Needed to generate a table dynamically
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
      <caption>
        <h1 contentEditable>Title</h1>
      </caption>
    );
  };

  return (
    <table ref={tableRef}>
      {title()}
      {matrix.map((row) => (
        <tr>
          {row.map((img) => (
            <td className={`pad-${pad % 5}`}>
              <Image img={img} showTitle={showTitles} />
            </td>
          ))}
        </tr>
      ))}
    </table>
  );
};

interface Props {
  tableRef: React.RefObject<HTMLTableElement>;
}

export const Chart: React.FC<Props> = ({ tableRef }) => {
  const { state } = useContext(ConfigContext);
  const { rows, cols, pad, showTitles, addTitle, chartType } = state;

  let images = defaultImages(rows, cols);

  const top50 = () => {
    return collage(images, rows, cols, pad, showTitles, addTitle, tableRef);
  };

  const chart = () => {
    if (chartType === ChartType.Collage) {
      return collage(images, rows, cols, pad, showTitles, addTitle, tableRef);
    }

    return top50();
  };

  return <div className="collage-container">{chart()}</div>;
};
