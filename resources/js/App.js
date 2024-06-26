import "./App.css";
import React, { useState } from "react";

function App() {
  const [placeholder, setPlaceholder] = useState("Select A Category");

  const handleSelectChange = (event) => {
    const value = event.target.value;
    if (value === "name") {
      setPlaceholder("Search a Name");
      searchName();
    } else if (value === "type") {
      setPlaceholder("Search a Type");
      searchType();
    } else if (value === "ability") {
      setPlaceholder("Search an Ability");
      searchAbility();
    } else {
      setPlaceholder("Select A Category");
    }
  };

  return (
    <div className="app-container">
      <div className="search-container">
        <header className="app-header">PokeSearch</header>
        <SelectBar onSelectChange={handleSelectChange} />
        <SearchBox placeholder={placeholder} />
      </div>
    </div>
  );
}

function SelectBar({ onSelectChange }) {
  return (
    <div>
      <form>
        <label className="">
          Pick your Search Category:
          <select className="select-category" onChange={onSelectChange}>
            <option value="search">Search by...</option>
            <option value="name">Name</option>
            <option value="type">Type</option>
            <option value="ability">Ability</option>
          </select>
        </label>
      </form>
    </div>
  );
}

function SearchBox({ placeholder }) {
  return (
    <form className="search-box">
      <input name="search-box" type="text" placeholder={placeholder}></input>
    </form>
  );
}

function searchName() {
  document.getElementsByClassName("search-box").placeholder.innerHTML =
    "Type a Name";
  //code in funtion to make search bar search for pokemon by names
}

function searchType() {
  //code in funtion to make search bar search for pokemon by type
}

function searchAbility() {
  //code in funtion to make search bar search for pokemon by ability
}

export default App;
