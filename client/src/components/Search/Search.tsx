import { ChangeEvent, useEffect, useState } from "react";
import "./Search.css";

type SearchProps = {
  searchCallback: (data: string) => void;
};

const Search = ({ searchCallback }: SearchProps) => {
  const [search, setSearch] = useState("");

  const searchHandler = (e: ChangeEvent) => setSearch((e.target as HTMLInputElement).value);

  useEffect(() => searchCallback(search), [search, searchCallback]);

  return <input className="Search" placeholder="Search... " onChange={searchHandler} value={search} />;
};

export default Search;
