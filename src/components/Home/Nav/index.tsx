import React from "react";

// Hooks
import useScreenshot from "use-screenshot-hook";
import { useConfig } from "../../../common/config";

// Components
import { Radio, Dropdown, Header, Label } from "semantic-ui-react";

// Types
import { CollageRef } from "../../../common/entities";

// Styles
import "./nav.css";

interface SliderProps {
  title: string;
  value: number;
  min: number;
  max: number;
  dispatch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Slider: React.FC<SliderProps> = ({ title, value, min, max, dispatch }) => {
  return (
    <div className="nav-menu-item">
      <p>{title}</p>
      <Label horizontal>{value}</Label>
      <input type="range" min={min} max={max} value={value} onChange={dispatch} />
    </div>
  );
};

interface Props {
  collageRef: CollageRef;
}

const Nav: React.FC<Props> = ({ collageRef }) => {
  //@ts-ignore
  const { takeScreenshot, isLoading } = useScreenshot({ ref: collageRef });

  const {
    config: { rows, cols, pad, fontSize, chartType, showTitlesBelow, showTitlesAside, addTitle, imageBig },
    dispatchConfig,
  } = useConfig();

  return (
    <nav>
      <div className="nav-menu">
        <Dropdown text="Edit" closeOnBlur={false} closeOnChange={false}>
          <Dropdown.Menu>
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
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown text="View" closeOnBlur={false} closeOnChange={false}>
          <Dropdown.Menu>
            <div className="nav-menu-view">
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
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown text="About">
          <Dropdown.Menu>
            <a
              className="nav-menu-item"
              href="https://gitlab.com/sacules/chartsy"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Dropdown.Item text="Collaborate" icon="gitlab" />
            </a>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <Header as="h4">
        <button
          onClick={async () => {
            let img = await takeScreenshot("png");
            let link = document.createElement("a");
            link.download = "chartsy.png";
            link.href = img as string;
            link.click();
          }}
        >
          {isLoading ? "Saving..." : "Save"}
        </button>
      </Header>
    </nav>
  );
};

export default Nav;
