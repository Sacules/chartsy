import React from "react";
import { Grid, Button } from "semantic-ui-react";

interface Props {
  cols: number;
  setCols: (cols: number) => void;
}

export const Save: React.FC<Props> = ({ cols, setCols }) => {
  return (
    <Grid>
      <Grid.Row>
        <Grid.Column>
          <p>
            <b>Columns </b>
            {cols}
          </p>
          <Button content="-" onClick={() => setCols(cols - 1)} />
          <Button content="+" onClick={() => setCols(cols + 1)} />
        </Grid.Column>
      </Grid.Row>

      <Grid.Row>
        <Button
          content="Save to PNG"
          onClick={() => {
            console.log("saving...");
          }}
        />
      </Grid.Row>
    </Grid>
  );
};
