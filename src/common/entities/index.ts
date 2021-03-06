import { MutableRefObject } from "react";

export enum ChartType {
  Collage,
  Top50,
  Top100,
}

export type Config = {
  rows: number;
  cols: number;
  pad: number;
  fontSize: number;
  showTitlesBelow: boolean;
  showTitlesAside: boolean;
  addTitle: boolean;
  imageBig: boolean;
  chartType: ChartType;
  chartTitle: string;
  backgroundColor: string;
};

export type ConfigAction = {
  type: "update" | "reset";
  field?:
    | "rows"
    | "cols"
    | "pad"
    | "fontSize"
    | "showTitlesBelow"
    | "showTitlesAside"
    | "addTitle"
    | "chartType"
    | "imageBig"
    | "chartTitle"
    | "backgroundColor";
  value?: string | number | boolean | ChartType;
};

export type Image = {
  title: string;
  author: string;
  url: string;
};

type ImageCell = {
  img: Image;
  pos: number;
};

export type ImagesAction = {
  type: "update" | "reset";
  value: ImageCell;
};

export enum SearchType {
  Art,
  Books,
  Games,
  Music,
  Movies,
  Series,
}

export type CollageRef = ((instance: HTMLDivElement) => void) | MutableRefObject<HTMLDivElement | null> | null;
