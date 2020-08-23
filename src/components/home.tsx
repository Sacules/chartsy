// @ts-nocheck

import React, { useState, useEffect } from "react";
import { Grid } from "semantic-ui-react";

import { Image, defaultImage } from "./image";
import { Search, SearchType } from "./search";
import { Collage } from "./collage";
import { getAlbum, getGame, getMovie, getSeries } from "./fetcher";
import { onResults } from "./results";

let defaultImages = () => {
  let imgs: Image[] = [];
  for (let i = 0; i < 20; i++) {
    imgs.push(defaultImage);
  }

  return imgs;
};

export const Home: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState(SearchType.Music);
  const [columns, setColumns] = useState(5);
  const [padding, setPadding] = useState(5);
  const [showTitle, setShowTitle] = useState(true);

  useEffect(() => {
    const download = async () => {
      if (search === "") {
        return;
      }

      switch (searchType) {
        case SearchType.Games:
          let albums = await getGame(search);
          setImages(albums);
          break;

        case SearchType.Movies:
          let movies = await getMovie(search);
          setImages(movies);
          break;

        case SearchType.Series:
          let series = await getSeries(search);
          setImages(series);
          break;

        default:
          let games = await getAlbum(search);
          setImages(games);
          break;
      }
    };

    download();
  }, [search, setImages, searchType]);

  return (
    <div className="home">
      <Grid padded>
        <Grid.Column width={3}>
          <Grid.Row>
            <Search setSearchType={setSearchType} setSearch={setSearch} />
          </Grid.Row>
          <Grid.Row padded>{onResults(search, images)}</Grid.Row>
        </Grid.Column>
        <Grid.Column width={padding}>
          <Collage
            pad={padding}
            setPad={setPadding}
            setCols={setColumns}
            cols={columns}
            images={defaultImages()}
            setTitleVisible={setShowTitle}
            titleVisible={showTitle}
          />
        </Grid.Column>
      </Grid>
    </div>
  );
};
