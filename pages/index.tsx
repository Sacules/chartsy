import Head from "next/head";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { isMobile } from "react-device-detect";
import { TouchBackend } from "react-dnd-touch-backend";

// Components
import { Search } from "@components/Search";
import { Nav } from "@components/Nav";
import { Chart } from "@components/Chart";

export default function Home() {
  return (
    <>
      <Head>
        <title>Chartsy</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="grid grid-rows-layout grid-cols-1 lg:grid-cols-layout">
        <Nav />
        <DndProvider backend={!isMobile ? TouchBackend : HTML5Backend}>
          <Search />
          <Chart />
        </DndProvider>
      </div>
    </>
  );
}
