import React from "react";

// Hooks
import useScreenshot from "use-screenshot-hook";

// Components
import { Header, Icon } from "semantic-ui-react";

// Types
import { CollageRef } from "../../../common/entities";

// Styles
import "./nav.css";

interface Props {
  collageRef: CollageRef;
  setShowDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

const Nav: React.FC<Props> = ({ collageRef, setShowDrawer }) => {
  //@ts-ignore
  const { takeScreenshot, isLoading } = useScreenshot({ ref: collageRef });

  return (
    <nav>
      <button onClick={() => setShowDrawer((show) => !show)}>
        <Icon name="setting" size="large" />
      </button>
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
