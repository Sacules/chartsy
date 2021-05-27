// @ts-nocheck
import React from "react";
import { Button, Menu, Form, Radio, Label } from "semantic-ui-react";
import { useScreenshot } from "use-screenshot-hook";

import { useConfig } from "../../../common/config";
import { ChartType, CollageRef } from "../../../common/entities";
import { useImages } from "../../../common/images";

interface Props {
  collageRef: CollageRef;
}

export const ConfigMenu: React.FC<Props> = ({ collageRef: chartRef }) => {
  const { config, dispatchConfig } = useConfig();
  const { dispatchImages } = useImages();
  const { rows, cols, pad, chartType, showTitlesBelow, showTitlesAside, addTitle, imageBig } = config;
  const { takeScreenshot, isLoading } = useScreenshot({ ref: chartRef });

  return (
    <Menu vertical text>
      <Menu.Item>
        <p>
          <b>Type</b>
        </p>
        <Form>
          <Form.Field>
            <Radio
              label="Collage"
              value="collage"
              checked={chartType === ChartType.Collage}
              onChange={(e) => {
                dispatchConfig({ type: "update", field: "chartType", value: ChartType.Collage });
                e.preventDefault();
              }}
            />
          </Form.Field>
          <Form.Field>
            <Radio
              label="Top 50"
              value="top50"
              checked={chartType === ChartType.Top50}
              onChange={(e) => {
                dispatchConfig({ type: "update", field: "chartType", value: ChartType.Top50 });
                e.preventDefault();
              }}
            />
          </Form.Field>
        </Form>
      </Menu.Item>
      <Menu.Item className="count-container">
        <p className="count">
          <b>Rows</b>
          <Label horizontal>{rows}</Label>
        </p>

        <Button content="-" onClick={() => dispatchConfig({ type: "update", field: "rows", value: rows - 1 })} />
        <Button content="+" onClick={() => dispatchConfig({ type: "update", field: "rows", value: rows + 1 })} />
      </Menu.Item>
      <Menu.Item className="count-container">
        <p className="count">
          <b>Columns</b>
          <Label horizontal>{cols}</Label>
        </p>
        <Button content="-" onClick={() => dispatchConfig({ type: "update", field: "cols", value: cols - 1 })} />
        <Button content="+" onClick={() => dispatchConfig({ type: "update", field: "cols", value: cols + 1 })} />
      </Menu.Item>

      <Menu.Item className="count-container">
        <p className="count">
          <b>Padding</b>
          <Label horizontal>{pad}</Label>
        </p>
        <Button content="-" onClick={() => dispatchConfig({ type: "update", field: "pad", value: pad - 1 })} />
        <Button content="+" onClick={() => dispatchConfig({ type: "update", field: "pad", value: pad + 1 })} />
      </Menu.Item>

      <Menu.Item>
        <Button
          content="Toggle size"
          onClick={() => dispatchConfig({ type: "update", field: "imageBig", value: !imageBig })}
        />
      </Menu.Item>

      <Menu.Item>
        <Button
          content="Add title"
          onClick={() => dispatchConfig({ type: "update", field: "addTitle", value: !addTitle })}
        />
      </Menu.Item>

      <Menu.Item>
        <Button
          content="Show titles below"
          onClick={() => dispatchConfig({ type: "update", field: "showTitlesBelow", value: !showTitlesBelow })}
        />
      </Menu.Item>

      <Menu.Item>
        <Button
          content="Show titles aside"
          onClick={() => dispatchConfig({ type: "update", field: "showTitlesAside", value: !showTitlesAside })}
        />
      </Menu.Item>

      <Menu.Item>
        <Button
          content="Reset"
          onClick={() => {
            dispatchConfig({ type: "reset" });
            dispatchImages({ type: "reset" });
          }}
        />
      </Menu.Item>

      <Menu.Item>
        <Button
          loading={isLoading}
          onClick={async () => {
            let img = await takeScreenshot("png");
            let link = document.createElement("a");
            link.download = "chartsy.png";
            link.href = img as string;
            link.click();
          }}
        >
          Save to PNG
        </Button>
      </Menu.Item>
    </Menu>
  );
};
