// Hooks
import { useChart } from "@contexts/ChartContext";

// Types
import { ChartRef, Image } from "@entities";

// Components
import { ChartImage } from "@components/ChartImage";
import { useConfig } from "@contexts/ConfigContext";

interface CollageProps {
  images: Image[];
  rows: number;
  cols: number;
  pad: number;
  showTitlesBelow: boolean;
  chartRef: ChartRef;
}

const Collage: React.FC<CollageProps> = ({
  images,
  rows,
  cols,
  pad,
  showTitlesBelow,
  chartRef,
}) => {
  images = [...images.slice(0, cols * rows)];
  return (
    <ul
      className={`transition-all grid grid-rows-${rows} grid-cols-${cols} gap-${pad} p-${pad} w-max bg-transparent`}
      ref={chartRef}
    >
      {images.map((img, i) => (
        <li key={`${i} - ${img.url}`}>
          <ChartImage pos={i} img={img} showTitle={showTitlesBelow} />
        </li>
      ))}
    </ul>
  );
};

interface Props {
  chartRef: ChartRef;
}

export const Chart: React.FC<Props> = ({ chartRef }) => {
  const {
    chart: { images },
  } = useChart();
  const {
    config: { rows, cols, pad, showTitlesBelow, backgroundColor },
  } = useConfig();

  return (
    <div
      className="p-4 overflow-x-auto overflow-y-auto flex justify-center items-start md:block grow"
      style={{ backgroundColor }}
    >
      <Collage
        images={images}
        rows={rows}
        cols={cols}
        pad={pad}
        showTitlesBelow={showTitlesBelow}
        chartRef={chartRef}
      />
    </div>
  );
};
