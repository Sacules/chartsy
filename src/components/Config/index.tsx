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
}) => (
  <div>
    <div className="flex justify-between">
      <p>{title}</p>
      <p>{value}</p>
    </div>
    <input
      className="w-full"
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={dispatch}
    />
  </div>
);
interface RadioProps {
  title: string;
  dispatch: () => void;
  checked: boolean;
}

const Radio: React.FC<RadioProps> = ({ title, dispatch, checked }) => (
  <label className="flex items-center" htmlFor={title}>
    <div className="relative cursor-pointer">
      <input
        id={title}
        className="sr-only"
        type="checkbox"
        checked={checked}
        onChange={dispatch}
      />
      <div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
      <div className="dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition"></div>
    </div>
    <p className="ml-4">{title}</p>
  </label>
);

interface Props {
  show: boolean;
}

export const Config: React.FC<Props> = ({ show }) => {
  const {
    config: { rows, cols, pad, showTitlesBelow },
    dispatch,
  } = useConfig();

  return (
    <aside
      className={`z-10 shadow overflow-hidden md:max-w-0 md:max-h-full transition-all duration-300 ${
        show ? "max-h-screen" : "max-h-0"
      }`}
    >
      <div className="p-4 bg-white flex flex-col gap-2 min-h-max md:min-w-max">
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
          min={0}
          max={8}
          dispatch={(e) =>
            dispatch({ type: "update", field: "pad", value: e.target.value })
          }
        />
        <Radio
          title="Show titles below"
          checked={showTitlesBelow}
          dispatch={() =>
            dispatch({
              type: "update",
              field: "showTitlesBelow",
              value: !showTitlesBelow,
            })
          }
        />
      </div>
    </aside>
  );
};
