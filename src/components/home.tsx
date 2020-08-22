import React, { useState, useEffect } from "react";
import { Grid, Button } from "semantic-ui-react";

import { onResults } from "./results";
import { Image, defaultImage } from "./image";
import { Search, SearchType } from "./search";
import { getAlbum, getGame, getMovie, getSeries } from "./fetcher";
import { Collage } from "./collage";

let defaultImages = () => {
  let imgs: Image[] = [];
  for (let i = 0; i < 50; i++) {
    imgs.push(defaultImage);
  }

  return imgs;
};

export const Home: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState(SearchType.Music);

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
      <Grid celled padded>
        <Grid.Column width={3}>
          <Grid.Row>
            <Button.Group>
              <Button
                basic
                icon="music"
                onClick={(e) => {
                  setSearchType(SearchType.Music);
                  e.preventDefault();
                }}
              />
              <Button
                basic
                icon="game"
                onClick={(e) => {
                  setSearchType(SearchType.Games);
                  e.preventDefault();
                }}
              />
              <Button
                basic
                icon="film"
                onClick={(e) => {
                  setSearchType(SearchType.Movies);
                  e.preventDefault();
                }}
              />
              <Button
                basic
                icon="tv"
                onClick={(e) => {
                  setSearchType(SearchType.Series);
                  e.preventDefault();
                }}
              />
            </Button.Group>
          </Grid.Row>
          <Grid.Row>
            <Search setSearch={setSearch} />
          </Grid.Row>
          <Grid.Row>{onResults(search, images)}</Grid.Row>
        </Grid.Column>
        <Grid.Column divided="horizontally" width={13}>
          <Collage images={defaultImages()} titleVisible={true} />
        </Grid.Column>
      </Grid>
    </div>
  );
};
