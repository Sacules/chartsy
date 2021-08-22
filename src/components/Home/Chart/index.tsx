import React, { useState } from "react";

// Hooks
import { defaultImage, useImageGrid } from "../../../common/imagegrid";
import { useConfig } from "../../../common/config";

// Components
import ImageCard from "../Chart/ImageCard";

// Types
import { ChartType, Image } from "../../../common/entities";
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
                  <ImageCard onGrid searchType={searchType} pos={n} img={img} showTitle={showTitlesBelow} />
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
                <ImageCard onGrid searchType={searchType} pos={n} img={img} showTitle={showTitlesBelow} />
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
                <ImageCard onGrid searchType={searchType} pos={n} img={img} showTitle={showTitlesBelow} />
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
  const [title, setTitle] = useState("");

  const {
    config: {
      rows,
      cols,
      pad,
      fontSize,
      showTitlesBelow,
      showTitlesAside,
      addTitle,
      chartType,
      chartTitle,
      backgroundColor,
    },
    dispatchConfig,
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
    <div
      style={{ backgroundColor }}
      className={`collage-container${showTitlesAside ? " collage-padded" : ""}`}
      ref={collageRef}
    >
      {addTitle && (
        <caption>
          <input
            style={{ backgroundColor }}
            className="collage-title"
            type="text"
            placeholder="[edit me]"
            value={title ? title : chartTitle}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => title && dispatchConfig({ type: "update", field: "chartTitle", value: title })}
          />
        </caption>
      )}
      <div className="table-container">
        {chart()}
        {showTitlesAside && (
          <ul className="titles">
            {images.map((img, i) => {
              if (img.url === defaultImage.url) {
                return undefined;
              }

              return (
                <li style={{ fontSize }} key={`image-title-${i}`}>
                  {i > 0 && i % cols === 0 && <br />}
                  <p style={{ lineHeight: `${fontSize / 10}rem` }}>
                    <b>{img.author}</b>
                    {img.title}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Chart;
