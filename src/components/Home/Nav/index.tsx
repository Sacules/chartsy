import React from "react";

// Hooks
import useScreenshot from "use-screenshot-hook";

// Types
import { CollageRef } from "../../../common/entities";

interface Props {
  collageRef: CollageRef;
}

const Nav: React.FC<Props> = ({ collageRef }) => {
  //@ts-ignore
  const { takeScreenshot, isLoading } = useScreenshot({ ref: collageRef });

  return (
    <nav>
      <h3>CHARTSY</h3>
      <h3>
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
      </h3>
    </nav>
  );
};

export default Nav;
