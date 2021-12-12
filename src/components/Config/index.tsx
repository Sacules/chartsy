import { useConfig } from "@contexts/ConfigContext";

interface SliderProps {
  title: string;
  value: number;
  min: number;
  max: number;
  dispatch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Slider: React.FC<SliderProps> = ({
  title,
  value,
  min,
  max,
  dispatch,
}) => {
  return (
    <div>
      <div className="flex justify-between">
        <p>{title}</p>
        <p>{value}</p>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={dispatch}
      />
    </div>
  );
};

export const Config: React.FC = () => {
  const {
    config: { rows, cols, pad },
    dispatch,
  } = useConfig();
  return (
    <div className="absolute inset-x-0 z-10 bg-white shadow p-4">
      <Slider
        title="Rows"
        value={rows}
        min={1}
        max={10}
        dispatch={(e) =>
          dispatch({ type: "update", field: "rows", value: e.target.value })
        }
      />
      <Slider
        title="Columns"
        value={cols}
        min={1}
        max={10}
        dispatch={(e) =>
          dispatch({ type: "update", field: "cols", value: e.target.value })
        }
      />
      <Slider
        title="Padding"
        value={pad}
        min={1}
        max={8}
        dispatch={(e) =>
          dispatch({ type: "update", field: "pad", value: e.target.value })
        }
      />
    </div>
  );
};
