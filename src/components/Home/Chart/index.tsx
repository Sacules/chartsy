import React from "react";

import { ChartType, Image } from "../../../common/entities";
import { defaultImage, useImageGrid } from "../../../common/imagegrid";
import ImageCard from "../Chart/ImageCard";
import { useConfig } from "../../../common/config";

import { SearchType, CollageRef } from "../../../common/entities";

const collage = (
  images: Image[],
  rows: number,
  cols: number,
  pad: number,
  showTitlesBelow: boolean,
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

  n = 0;

  return (
    <table>
      <tbody>
        {matrix.map((row) => (
          <tr key={n}>
            {row.map((img) => {
              let cell = (
                <td className={`pad-${pad}`} key={n}>
                  <ImageCard searchType={searchType} pos={n} img={img} showTitle={showTitlesBelow} />
                </td>
              );
              n++;
              return cell;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const top50 = (images: Image[], pad: number, showTitlesBelow: boolean, searchType: SearchType) => {
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
      <tr>{topcells}</tr>
      <tr className="top-10-bottom">{bottomcells}</tr>
    </table>
  );
};

interface Props {
  collageRef: CollageRef;
  searchType: SearchType;
}

const Chart: React.FC<Props> = ({ searchType, collageRef }) => {
  const {
    config: { rows, cols, pad, showTitlesBelow, showTitlesAside, addTitle, chartType },
  } = useConfig();
  const {
    imageGrid: { images },
  } = useImageGrid();

  const chart = () => {
    if (chartType === ChartType.Collage) {
      return collage(images, rows, cols, pad, showTitlesBelow, searchType);
    }

    return top50(images, pad, showTitlesBelow, searchType);
  };

  return (
    <div className={`collage-container${showTitlesAside ? " collage-padded" : ""}`} ref={collageRef}>
      {addTitle && (
        <caption>
          <h1 contentEditable>[edit me]</h1>
        </caption>
      )}
      <div>
        {chart()}
        {showTitlesAside && (
          <ul className="titles">
            {images.map((img, i) => (
              <>
                {img.url !== defaultImage.url && (
                  <li key={`image-title-${i}`}>
                    {i > 0 && i % cols === 0 && <br />}
                    <b>{img.author}</b>
                    {img.title}
                  </li>
                )}
              </>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Chart;
