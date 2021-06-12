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
    config: { rows, cols, pad, fontSize, showTitlesBelow, showTitlesAside, addTitle, imageBig },
    dispatchConfig,
  } = useConfig();

  return (
    <div id="config">
      <Slider
        title="Rows"
        value={rows}
        min={1}
        max={10}
        dispatch={(e) => dispatchConfig({ type: "update", field: "rows", value: e.target.value })}
      />
      <Slider
        title="Columns"
        value={cols}
        min={1}
        max={10}
        dispatch={(e) => dispatchConfig({ type: "update", field: "cols", value: e.target.value })}
      />
      <Slider
        title="Padding"
        value={pad}
        min={0}
        max={4}
        dispatch={(e) => dispatchConfig({ type: "update", field: "pad", value: e.target.value })}
      />
      <Slider
        title="Font size"
        value={fontSize}
        min={12}
        max={32}
        dispatch={(e) => dispatchConfig({ type: "update", field: "fontSize", value: e.target.value })}
      />
      <Radio
        label="Show bigger"
        checked={imageBig}
        onClick={() => dispatchConfig({ type: "update", field: "imageBig", value: !imageBig })}
        toggle
      />
      <Radio
        label="Add title"
        checked={addTitle}
        onClick={() => dispatchConfig({ type: "update", field: "addTitle", value: !addTitle })}
        toggle
      />
      <Radio
        label="Show titles below"
        checked={showTitlesBelow}
        onClick={() => dispatchConfig({ type: "update", field: "showTitlesBelow", value: !showTitlesBelow })}
        toggle
      />
      <Radio
        label="Show titles aside"
        checked={showTitlesAside}
        onClick={() => dispatchConfig({ type: "update", field: "showTitlesAside", value: !showTitlesAside })}
        toggle
      />
    </div>
  );
};
