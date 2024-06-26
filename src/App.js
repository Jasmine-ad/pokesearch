import "./App.css";
import React, { useState, useEffect } from "react";
import CategorySelector from "./components/CategorySelector";
import SearchBox from "./components/SearchBox";

const SEARCH_PLACEHOLDERS = {
  name: "Search a Name",
  type: "Search a Type",
  ability: "Search an Ability",
  "": "Select A Category",
};

function App() {
  const [category, setCategory] = useState("");
  const [placeholder, setPlaceholder] = useState("");

  useEffect(() => {
    setPlaceholder(SEARCH_PLACEHOLDERS[category]);
  }, [category]);

  return (
    <div className="app-container">
      <div className="search-container">
        <header className="app-header">PokeSearch</header>
        <CategorySelector onChange={setCategory} value={category} />
        <SearchBox placeholder={placeholder} />
      </div>
    </div>
  );
}

function searchName() {
  //code in funtion to make search bar search for pokemon by names
}

function searchType() {
  //code in funtion to make search bar search for pokemon by type
}

function searchAbility() {
  //code in funtion to make search bar search for pokemon by ability
}

export default App;
