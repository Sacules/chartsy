import React, { useState } from "react";

interface Props {
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

export const Search: React.FC<Props> = ({ setSearch }) => {
  const [val, setVal] = useState("");

  return (
    <form
      onSubmit={(e) => {
        setSearch(val);
        e.preventDefault();
      }}
    >
      <label>
        <p>Search for an album:</p>
        <input
          type="text"
          value={val}
          onChange={(e) => {
            setVal(e.target.value);
            e.preventDefault();
          }}
        />
      </label>
    </form>
  );
};
