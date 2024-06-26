function SearchBox({ placeholder }) {
  return (
    <form className="search-box">
      <input name="search-box" type="text" placeholder={placeholder}></input>
    </form>
  );
}

export default SearchBox;
