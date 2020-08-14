import React from "react";
import { Dropdown } from "semantic-ui-react";

import { Image } from "./image";

import "./collage.css";

interface Props {
  images: Image[];
  titleVisible: boolean;
}

export const Collage: React.FC<Props> = ({ images, titleVisible }) => {
  const results = images.map((img) => {
    const val = img.author + " - " + img.title;
    return { key: img.url, text: val, value: val, image: { avatar: false, src: img.url } };
  });
  return <Dropdown placeholder="Click here to see results!" fluid selection options={results} />;
  /* return ( */
  /*   <div className="collage-container"> */
  /*     {images.map((img) => ( */
  /*       <Image key={img.url} image={img} showTitle={titleVisible} /> */
  /*     ))} */
  /*   </div> */
  /* ); */
};
