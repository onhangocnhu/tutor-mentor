import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Library.css";

interface SearchBarProps {
  initialValue?: string;
  placeholder?: string;
  popularTags?: string[];
  onSearch?: (query: string) => void;
  navigateOnSearch?: boolean;
  size?: "normal" | "large";
}

const SearchBar: React.FC<SearchBarProps> = ({
  initialValue = "",
  placeholder = "Tìm kiếm sách, tạp chí, luận văn",
  popularTags = [],
  onSearch,
  navigateOnSearch = true,
  size = "normal",
}) => {
  const [query, setQuery] = useState(initialValue);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query);
    }
    if (navigateOnSearch && query.trim()) {
      navigate(`/library/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    if (navigateOnSearch) {
      navigate(`/library/search?q=${encodeURIComponent(tag)}`);
    } else if (onSearch) {
      onSearch(tag);
    }
  };

  return (
    <div className={`search-bar-container search-bar-${size}`}>
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="search-input"
        />
        <button className="search-btn" onClick={handleSearch}>
          Tìm kiếm
        </button>
      </div>

      {popularTags.length > 0 && (
        <div className="search-tags">
          <span className="search-tags-label">Phổ biến:</span>
          {popularTags.map((tag) => (
            <button
              key={tag}
              className="search-tag"
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
