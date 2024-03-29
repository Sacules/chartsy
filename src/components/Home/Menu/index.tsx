import React from "react";
import { Radio, Label } from "semantic-ui-react";

import { useConfig } from "../../../common/config";

// Styles
import "./menu.css";

interface SliderProps {
  title: string;
  value: number;
  min: number;
  max: number;
  dispatch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Slider: React.FC<SliderProps> = ({ title, value, min, max, dispatch }) => {
  return (
    <div className="slider">
      <div className="slider-info">
        <p>{title}</p>
        <Label horizontal>{value}</Label>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={dispatch} />
    </div>
  );
};

export const ConfigMenu: React.FC = () => {
  const {
    config: { rows, cols, pad, fontSize, imageSize, showTitlesBelow, showTitlesAside, addTitle, backgroundColor },
    dispatch,
  } = useConfig();

  return (
    <div id="config">
      <Slider
        title="Rows"
        value={rows}
        min={1}
        max={10}
        dispatch={(e) => dispatch({ type: "update", field: "rows", value: e.target.value })}
      />
      <Slider
        title="Columns"
        value={cols}
        min={1}
        max={10}
        dispatch={(e) => dispatch({ type: "update", field: "cols", value: e.target.value })}
      />
      <Slider
        title="Padding"
        value={pad}
        min={0}
        max={4}
        dispatch={(e) => dispatch({ type: "update", field: "pad", value: e.target.value })}
      />
      <Slider
        title="Font size"
        value={fontSize}
        min={14}
        max={32}
        dispatch={(e) => dispatch({ type: "update", field: "fontSize", value: e.target.value })}
      />
      <Slider
        title="Image size"
        value={imageSize}
        min={100}
        max={200}
        dispatch={(e) => dispatch({ type: "update", field: "imageSize", value: e.target.value })}
      />
      <div className="config-color-picker">
        <label htmlFor="color">Background color</label>
        <input
          type="color"
          id="color"
          name="color"
          value={backgroundColor}
          onChange={(e) => dispatch({ type: "update", field: "backgroundColor", value: e.target.value })}
        />
      </div>
      <Radio
        label="Add title"
        checked={addTitle}
        onClick={() => dispatch({ type: "update", field: "addTitle", value: !addTitle })}
        toggle
      />
      <Radio
        label="Show titles below"
        checked={showTitlesBelow}
        onClick={() => dispatch({ type: "update", field: "showTitlesBelow", value: !showTitlesBelow })}
        toggle
      />
      <Radio
        label="Show titles aside"
        checked={showTitlesAside}
        onClick={() => dispatch({ type: "update", field: "showTitlesAside", value: !showTitlesAside })}
        toggle
      />
    </div>
  );
};
