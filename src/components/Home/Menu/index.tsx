// @ts-nocheck
import React from "react";
import { Grid, Button, Form, Radio, Label } from "semantic-ui-react";
import { useScreenshot } from "use-screenshot-hook";

import { useConfig } from "../../../common/config";
import { ChartType, CollageRef } from "../../../common/entities";
import { useImageGrid } from "../../../common/imagegrid";

interface Props {
  collageRef: CollageRef;
}

export const ConfigMenu: React.FC<Props> = ({ collageRef: chartRef }) => {
  const {
    config: { rows, cols, pad, chartType, showTitlesBelow, showTitlesAside, addTitle, imageBig },
    dispatchConfig,
  } = useConfig();
  const { dispatch: dispatchImages } = useImageGrid();
  const { takeScreenshot, isLoading } = useScreenshot({ ref: chartRef });

  return (
    <div className="config">
      <Form>
        <p className="collage-type">
          <b>Type</b>
        </p>
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
      <div className="count-container">
        <div className="count">
          <p>
            <b>Rows</b>
          </p>
          <Label className="count-label" horizontal>
            {rows}
          </Label>
        </div>
        <Grid columns="2">
          <Grid.Column>
            <Button
              compact
              content="-"
              onClick={() => dispatchConfig({ type: "update", field: "rows", value: rows - 1 })}
            />
          </Grid.Column>
          <Grid.Column>
            <Button
              compact
              content="+"
              onClick={() => dispatchConfig({ type: "update", field: "rows", value: rows + 1 })}
            />
          </Grid.Column>
        </Grid>
      </div>
      <div className="count-container">
        <div className="count">
          <p>
            <b>Columns</b>
          </p>
          <Label className="count-label" horizontal>
            {cols}
          </Label>
        </div>
        <Grid columns="2">
          <Grid.Column>
            <Button
              compact
              content="-"
              onClick={() => dispatchConfig({ type: "update", field: "cols", value: cols - 1 })}
            />
          </Grid.Column>
          <Grid.Column>
            <Button
              compact
              content="+"
              onClick={() => dispatchConfig({ type: "update", field: "cols", value: cols + 1 })}
            />
          </Grid.Column>
        </Grid>
      </div>

      <div className="count-container">
        <div className="count">
          <p>
            <b>Padding</b>
          </p>
          <Label className="count-label" horizontal>
            {pad}
          </Label>
        </div>
        <Grid columns="2">
          <Grid.Column>
            <Button
              compact
              content="-"
              onClick={() => dispatchConfig({ type: "update", field: "pad", value: pad - 1 })}
            />
          </Grid.Column>
          <Grid.Column>
            <Button
              compact
              content="+"
              onClick={() => dispatchConfig({ type: "update", field: "pad", value: pad + 1 })}
            />
          </Grid.Column>
        </Grid>
      </div>

      <div className="config-radios">
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
      </div>

      <div className="config-radios">
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

      <div className="config-radios">
        <Button
          compact
          content="Reset"
          onClick={() => {
            dispatchConfig({ type: "reset" });
            dispatchImages({ type: "reset" });
          }}
        />
      </div>

      <div className="config-radios">
        <Button
          compact
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
      </div>
    </div>
  );
};
