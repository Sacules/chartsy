import React, { useState, useEffect } from "react";

import { SearchResults } from "./results";
import { Image, defaultImage } from "./image";
import { Search } from "./search";
import { getAlbum } from "./fetcher";
import { Grid } from "semantic-ui-react";
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
  // const [n, setN] = useState(50);

  useEffect(() => {
    const download = async () => {
      if (search === "") {
        return;
      }

      let albums = await getAlbum(search);
      setImages(albums);
    };

    download();
  }, [search, setImages]);

  const onResults = () => {
    if (search === "") {
      return "";
    }

    if (search.startsWith("http") || search.endsWith(".jpg") || search.endsWith(".png")) {
      const img: Image = { url: search, author: "", title: "" };
      const images: Image[] = [];
      images.push(img);

      return <SearchResults images={images} />;
    }

    return <SearchResults images={images} />;
  };

  return (
    <div className="home">
      <Grid celled>
        <Grid.Row>
          <Grid.Column width={3}>
            <Grid.Row>
              <Search setSearch={setSearch} />
            </Grid.Row>
            <Grid.Row>{onResults()}</Grid.Row>
          </Grid.Column>
          <Grid.Column divided="horizontally" width={12}>
            <Collage images={defaultImages()} titleVisible={false} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};
