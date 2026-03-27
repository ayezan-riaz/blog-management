import { useState, useEffect } from 'react';
import { HiSearch, HiX } from 'react-icons/hi';
import './SearchBar.css';

const SearchBar = ({ onSearch, placeholder = 'Search posts...', value = '' }) => {
  const [query, setQuery] = useState(value);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 400);
    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="search-bar" id="search-bar">
      <HiSearch className="search-icon" />
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        id="search-input"
      />
      {query && (
        <button className="search-clear" onClick={handleClear}>
          <HiX />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
