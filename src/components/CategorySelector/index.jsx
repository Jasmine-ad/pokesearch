function CategorySelector({ onChange, value }) {
  return (
    <div>
      <form>
        <label className="">
          Pick your Search Category:
          <select
            className="select-category"
            onChange={(event) => onChange(event.target.value)}
            value={value}
          >
            <option value="">Search by...</option>
            <option value="name">Name</option>
            <option value="type">Type</option>
            <option value="ability">Ability</option>
          </select>
        </label>
      </form>
    </div>
  );
}

export default CategorySelector;
