import React, { MutableRefObject, useContext } from "react";

import { Image, ImagesContext, defaultImage } from "./images";
import { ImageCard } from "./image";
import { ChartType, ConfigContext } from "./config";

import { SearchType } from "./search";

export type collageRef = ((instance: HTMLDivElement) => void) | MutableRefObject<HTMLDivElement | null> | null;

const collage = (
  images: Image[],
  rows: number,
  cols: number,
  pad: number,
  showTitlesBelow: boolean,
  addTitle: boolean,
  searchType: SearchType
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
        <h1 contentEditable>[edit me]</h1>
      </caption>
    );
  };

  n = 0;

  return (
    <table>
      {title()}
      {matrix.map((row) => (
        <tr>
          {row.map((img) => {
            let cell = (
              <td className={`pad-${pad}`}>
                <ImageCard searchType={searchType} pos={n} img={img} showTitle={showTitlesBelow} />
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

const top50 = (
  images: Image[],
  pad: number,
  showTitlesAside: boolean,
  showTitlesBelow: boolean,
  searchType: SearchType
) => {
  let top10: Image[][] = [];
  let n = 0;
  for (let i = 0; i < 1; i++) {
    let row: Image[] = new Array(10);
    top10.push(row);
    for (let j = 0; j < 10; j++) {
      top10[i][j] = images[n];
      n++;
    }
  }

  let last = n;
  n = 0;

  const topcells = (
    <table className="top-10-top">
      <caption>
        <h3 contentEditable>Top 10</h3>
      </caption>

      {top10.map((row) => (
        <tr>
          {row.map((img) => {
            let cell = (
              <td className={`pad-${pad}`}>
                <ImageCard searchType={searchType} pos={n} img={img} showTitle={showTitlesBelow} />
              </td>
            );
            n++;
            return cell;
          })}
        </tr>
      ))}
    </table>
  );

  let rest: Image[][] = [];
  n = last;
  for (let i = 0; i < 4; i++) {
    let row: Image[] = new Array(10);
    rest.push(row);
    for (let j = 0; j < 10; j++) {
      rest[i][j] = images[n];
      n++;
    }
  }

  n = last;
  const bottomcells = (
    <table className="top-10-bottom">
      <caption>
        <h3 contentEditable>Classics</h3>
      </caption>

      {rest.map((row) => (
        <tr>
          {row.map((img) => {
            let cell = (
              <td className={`pad-${pad}`}>
                <ImageCard searchType={searchType} pos={n} img={img} showTitle={showTitlesBelow} />
              </td>
            );
            n++;
            return cell;
          })}
        </tr>
      ))}
    </table>
  );

  return (
    <table>
      <caption>
        <h1 contentEditable>Epic Top 50!</h1>
      </caption>

      <tr>{topcells}</tr>
      <tr className="top-10-bottom">{bottomcells}</tr>
    </table>
  );
};

interface Props {
  collageRef: collageRef;
  searchType: SearchType;
}

export const Chart: React.FC<Props> = ({ searchType, collageRef }) => {
  const { config } = useContext(ConfigContext);
  const { images } = useContext(ImagesContext);
  const { rows, cols, pad, showTitlesBelow, showTitlesAside, addTitle, chartType } = config;

  const chart = () => {
    if (chartType === ChartType.Collage) {
      return collage(images, rows, cols, pad, showTitlesBelow, addTitle, searchType);
    }

    return top50(images, pad, showTitlesAside, showTitlesBelow, searchType);
  };

  const titleList = () => {
    if (!showTitlesAside) {
      return "";
    }

    return (
      <ul className="titles">
        {images.map((img) => {
          if (img.url === defaultImage.url) {
            return "";
          }

          return (
            <li>
              <b>{img.author}</b>
              {img.title}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="collage-container" ref={collageRef}>
      {chart()}
      {titleList()}
    </div>
  );
};
