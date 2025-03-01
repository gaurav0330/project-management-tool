import { useState } from "react";

const SearchUser = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <input
      type="text"
      placeholder="Type to search users..."
      value={query}
      onChange={handleChange}
      className="w-full p-2 border rounded"
    />
  );
};

export default SearchUser;
