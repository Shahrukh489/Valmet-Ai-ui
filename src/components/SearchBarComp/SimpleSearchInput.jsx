import React, { useState } from "react";
import { Search, X, Loader2 } from "lucide-react";

function SimpleSearchInput({
  placeholder = "Search...",
  value,
  onChange,
  onSearch,
  loading = false,
  icon: Icon = Search,
  className = "",
}) {
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleClear = () => {
    onChange("");
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div
        className={`relative flex items-center bg-white border rounded-lg transition-all duration-200 ${
          isFocused
            ? "border-blue-500 shadow-md ring-2 ring-blue-500/20"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        {/* Search Icon */}
        <div className="pl-3 pr-2">
          <Icon className="h-4 w-4 text-gray-400" />
        </div>

        {/* Search Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 py-2 pr-8 text-sm text-gray-900 placeholder-gray-500 focus:outline-none"
        />

        {/* Clear Button or Loading Spinner */}
        {loading ? (
          <div className="pr-3">
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          </div>
        ) : value ? (
          <button
            type="button"
            onClick={handleClear}
            className="pr-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </form>
  );
}

export default SimpleSearchInput;