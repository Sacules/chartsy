import React, { useContext } from "react";

import { Image, ImagesContext } from "./images";
import { ImageCard } from "./image";
import { ChartType, ConfigContext } from "./config";

import "./collage.css";
import { SearchType } from "./search";

const collage = (
  images: Image[],
  rows: number,
  cols: number,
  pad: number,
  showTitles: boolean,
  addTitle: boolean,
  searchType: SearchType,
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

  n = 0;

  return (
    <table ref={tableRef}>
      {title()}
      {matrix.map((row) => (
        <tr>
          {row.map((img) => {
            let cell = (
              <td className={`pad-${pad}`}>
                <ImageCard searchType={searchType} pos={n} img={img} showTitle={showTitles} />
              </td>
            );
            n++;
            return cell;
          })}
        </tr>
      ))}
    </table>
  );
};

interface Props {
  tableRef: React.RefObject<HTMLTableElement>;
  searchType: SearchType;
}

export const Chart: React.FC<Props> = ({ searchType, tableRef }) => {
  const { config } = useContext(ConfigContext);
  const { images } = useContext(ImagesContext);
  const { rows, cols, pad, showTitles, addTitle, chartType } = config;

  const top50 = () => {
    return collage(images, rows, cols, pad, showTitles, addTitle, searchType, tableRef);
  };

  const chart = () => {
    if (chartType === ChartType.Collage) {
      return collage(images, rows, cols, pad, showTitles, addTitle, searchType, tableRef);
    }

    return top50();
  };

  return <div className="collage-container">{chart()}</div>;
};
