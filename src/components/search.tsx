import React, { useState } from "react";
import { Input } from "semantic-ui-react";

export enum SearchType {
  Music,
  Movies,
  Games,
  Books,
  Art,
}

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
      <Input
        fluid
        placeholder="Search for an album"
        value={val}
        onChange={(e) => {
          setVal(e.target.value);
          e.preventDefault();
        }}
      />
    </form>
  );
};
