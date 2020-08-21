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

const onSearchType = (type: SearchType, setSearchType: React.Dispatch<React.SetStateAction<SearchType>>) => {
  switch (type) {
    case SearchType.Games:
      return (
        <Grid.Row>
          <Button
            basic
            icon="music"
            onClick={(e) => {
              setSearchType(SearchType.Music);
              e.preventDefault();
            }}
          />
          <Button basic primary icon="game" />
          <Button
            basic
            icon="film"
            onClick={(e) => {
              setSearchType(SearchType.Movies);
              e.preventDefault();
            }}
          />
        </Grid.Row>
      );

    case SearchType.Movies:
      return (
        <Grid.Row>
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
          <Button basic primary icon="film" />
        </Grid.Row>
      );

    default:
      return (
        <Grid.Row>
          <Button basic primary icon="music" />
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
        </Grid.Row>
      );
  }
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
      <Grid celled>
        <Grid.Column width={3}>
          {onSearchType(searchType, setSearchType)}
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
