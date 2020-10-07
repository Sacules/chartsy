// @ts-nocheck
import React, { useContext } from "react";
import { Button, Menu, Form, Radio, Label } from "semantic-ui-react";
import { useScreenshot } from "use-screenshot-hook";

import { ChartType, ConfigContext } from "./config";

interface Props {
  tableRef: React.RefObject<HTMLTableElement>;
}

export const ConfigMenu: React.FC<Props> = ({ tableRef: chartRef }) => {
  const { config, dispatchConfig } = useContext(ConfigContext);
  const { rows, cols, pad, chartType, showTitles, addTitle } = config;
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
                dispatchConfig({ type: "chart", value: ChartType.Collage });
                e.preventDefault();
              }}
            />
          </Form.Field>
          {/* <Form.Field> */}
          {/*   <Radio */}
          {/*     label="Top 50" */}
          {/*     value="top50" */}
          {/*     checked={chartType === ChartType.Top50} */}
          {/*     onChange={(e) => { */}
          {/*       dispatchConfig({ type: "chart", value: ChartType.Top50 }); */}
          {/*       dispatchConfig({ type: "rows", value: 5 }); */}
          {/*       dispatchConfig({ type: "cols", value: 10 }); */}
          {/*       e.preventDefault(); */}
          {/*     }} */}
          {/*   /> */}
          {/* </Form.Field> */}
        </Form>
      </Menu.Item>
      <Menu.Item className="count-container">
        <p className="count">
          <b>Rows</b>
          <Label horizontal>{rows}</Label>
        </p>

        <Button content="-" onClick={() => dispatchConfig({ type: "rows", value: rows - 1 })} />
        <Button content="+" onClick={() => dispatchConfig({ type: "rows", value: rows + 1 })} />
      </Menu.Item>
      <Menu.Item className="count-container">
        <p className="count">
          <b>Columns</b>
          <Label horizontal>{cols}</Label>
        </p>
        <Button content="-" onClick={() => dispatchConfig({ type: "cols", value: cols - 1 })} />
        <Button content="+" onClick={() => dispatchConfig({ type: "cols", value: cols + 1 })} />
      </Menu.Item>

      <Menu.Item className="count-container">
        <p className="count">
          <b>Padding</b>
          <Label horizontal>{pad}</Label>
        </p>
        <Button content="-" onClick={() => dispatchConfig({ type: "pad", value: pad - 1 })} />
        <Button content="+" onClick={() => dispatchConfig({ type: "pad", value: pad + 1 })} />
      </Menu.Item>

      <Menu.Item>
        <Button content="Add title" onClick={() => dispatchConfig({ type: "addTitle", value: !addTitle })} />
      </Menu.Item>

      <Menu.Item>
        <Button content="Show titles" onClick={() => dispatchConfig({ type: "showTitles", value: !showTitles })} />
      </Menu.Item>

      <Menu.Item>
        <Button
          loading={isLoading}
          onClick={async () => {
            // Fix weird margin cropping the table
            let ref = chartRef.current as HTMLTableElement;
            const prevMargin = ref.style.margin;
            ref.style.margin = "0";

            let img = await takeScreenshot("png");
            let link = document.createElement("a");
            link.download = "topsters3.png";
            link.href = img as string;
            link.click();

            ref.style.margin = prevMargin;
          }}
        >
          Save to PNG
        </Button>
      </Menu.Item>
    </Menu>
  );
};
