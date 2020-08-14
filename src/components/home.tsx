import React, { useState, useEffect } from "react";
import { Collage } from "./collage";
import { Image } from "./image";
import { Search } from "./search";
import { getAlbum } from "./fetcher";

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

  if (search === "") {
    return <Search setSearch={setSearch} />;
  }

  return (
    <div className="home">
      <Search setSearch={setSearch} />
      <span>
        <Collage images={images} titleVisible={true} />
      </span>
    </div>
  );
};
