import React, { useState, useRef, useEffect } from "react";
import { Search, X, Loader2, Clock, AlertTriangle } from "lucide-react";

function SearchBar(props) {
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [showNotFoundModal, setShowNotFoundModal] = useState(false);
  const [showSparePartNotFoundModal, setShowSparePartNotFoundModal] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);

  const SPAREPARTSAPI_BASE_URL =
    "https://wea-spt-use-dv-sparepartsapi-001.azurewebsites.net";

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem(`searchHistory_${props.tag}`);
    if (history) {
      setSearchHistory(JSON.parse(history).slice(0, 5));
    }
  }, [props.tag]);

  // Handle clicks outside of suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const saveToHistory = (value) => {
    const newHistory = [value, ...searchHistory.filter(item => item !== value)].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem(`searchHistory_${props.tag}`, JSON.stringify(newHistory));
  };

  async function handleParse(e) {
    e.preventDefault();
    if (!searchValue.trim()) return;

    setIsLoading(true);
    setShowSuggestions(false);
    const searchInput = searchValue.toUpperCase();
    saveToHistory(searchInput);

    try {
      // GC search
      if (props.tag === "spareparts") {
        if (searchInput.includes("7KQ3118")) {
          const encodedSearchTerm = encodeURIComponent(searchInput);
          props.setGCSearchState?.();
          props.onGCSearch?.(encodedSearchTerm);
          setIsLoading(false);
          return;
        }

        // Regular part number search
        const URL = `${SPAREPARTSAPI_BASE_URL}/v1/spareparts/api/spareparts/GetSparePartByPartNumber?partNumber=${searchInput}`;
        const response = await fetch(URL);
        const x = await response.json();

        if (!x.result || Object.keys(x.result).length === 0) {
          setShowSparePartNotFoundModal(true);
        } else {
          props.part(x.result);
        }
      }

      // Price update search
      if (props.tag === "priceupdate") {
        const URL = `${SPAREPARTSAPI_BASE_URL}/v1/spareparts/api/spareparts/GetSparePartByPartNumber?partNumber=${searchInput}`;
        const response = await fetch(URL);
        const x = await response.json();

        if (!x.result || Object.keys(x.result).length === 0) {
          setShowSparePartNotFoundModal(true);
        } else {
          props.part(x.result);
        }
      }

      // Config column search
      const configURL = `https://wea-spt-use-dv-configurationsapi-001.azurewebsites.net/v1/configurations/getPackedColumn?partNumber=${searchInput}`;
      if (
        searchInput.includes("COL") ||
        searchInput.includes("A6X") ||
        searchInput.includes("US2") ||
        searchInput.includes("2021")
      ) {
        const response = await fetch(configURL);
        const x = await response.json();
        props.getPreSetOptions(x.result.options || []);

        if (x.result.errors?.length > 0) {
          showErrorModalWithErrors(x.result.errors);
        }

        if (!x.result.options || x.result.options.length === 0) {
          setShowNotFoundModal(true);
        }
      }

      // Parse string
      if (searchInput.includes("7KQ2908")) {
        const encodedSearchTerm = encodeURIComponent(searchInput);
        const response = await fetch(
          `https://wea-spt-use-dv-configurationsapi-001.azurewebsites.net/v1/configurations/parseMLFBString?mlfb=${encodedSearchTerm}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );
        const x = await response.json();
        props.getPreSetOptions(x.result || []);
        props.result(x.result);
      } else {
        const response = await fetch(configURL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(props.data),
        });
        const parsedJSON = await response.json();
        props.result(parsedJSON.result);
      }
    } catch (e) {
      console.error("Error:", e);
    } finally {
      setIsLoading(false);
    }
  }

  const showErrorModalWithErrors = (errors) => {
    setErrorMessages(errors);
    setShowErrorModal(true);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    searchInputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchValue(suggestion);
    setShowSuggestions(false);
    // Trigger search with the suggestion
    setTimeout(() => {
      searchInputRef.current?.form?.requestSubmit();
    }, 0);
  };

  const filteredSuggestions = searchHistory.filter(item =>
    item.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleParse} className="relative">
        <div
          className={`relative flex items-center bg-input border rounded-lg azure-transition ${
            isFocused
              ? "border-primary azure-shadow-md ring-2 ring-primary/20"
              : "border-border hover:border-primary/50 azure-shadow-sm"
          }`}
        >
          {/* Search Icon */}
          <div className="pl-4 pr-2">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>

          {/* Search Input */}
          <input
            ref={searchInputRef}
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              setShowSuggestions(true);
            }}
            onBlur={() => setIsFocused(false)}
            placeholder={props.placeholder || "Search parts, configurations, or MLFB codes..."}
            className="flex-1 py-3 pr-20 text-foreground placeholder-muted-foreground bg-transparent focus:outline-none"
            aria-label="Search"
          />

          {/* Clear Button */}
          {searchValue && !isLoading && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="p-2 text-muted-foreground hover:text-foreground azure-transition"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Loading Spinner */}
          {isLoading && (
            <div className="p-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            </div>
          )}

          {/* Search Button */}
          <button
            type="submit"
            disabled={isLoading || !searchValue.trim()}
            className="mr-1 azure-btn-primary azure-space-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Search"
            )}
          </button>
        </div>

        {/* Search Suggestions */}
        {showSuggestions && filteredSuggestions.length > 0 && searchValue && (
          <div
            ref={suggestionsRef}
            className="absolute z-50 w-full mt-2 bg-popover rounded-lg azure-shadow-lg border border-border overflow-hidden animate-azure-scale-in"
          >
            <div className="py-1">
              <div className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border">
                <div className="flex items-center azure-gap-xs">
                  <Clock className="w-3 h-3" />
                  <span>Recent Searches</span>
                </div>
              </div>
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-3 text-left text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground azure-transition flex items-center azure-gap-sm"
                >
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono">{suggestion}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </form>

      {/* Azure Error Modal */}
      {showErrorModal && (
        <div className="azure-modal-overlay">
          <div className="azure-modal">
            <div className="azure-modal-header">
              <div className="flex items-center azure-gap-sm">
                <AlertTriangle className="w-6 h-6 text-warning" />
                <h3 className="text-lg font-semibold text-card-foreground">
                  Configuration Errors
                </h3>
              </div>
            </div>
            <div className="azure-modal-body">
              <p className="text-muted-foreground azure-mb-md">
                The following errors were encountered while processing your configuration:
              </p>
              <div className="space-y-2">
                {errorMessages.length > 0 ? (
                  errorMessages.map((error, index) => (
                    <div key={index} className="bg-warning/10 border border-warning/20 rounded-lg azure-space-sm">
                      <p className="text-sm text-warning-foreground">{error}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No specific error messages available.</p>
                )}
              </div>
            </div>
            <div className="azure-modal-footer">
              <button
                onClick={() => setShowErrorModal(false)}
                className="azure-btn-primary"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Azure Column Not Found Modal */}
      {showNotFoundModal && (
        <div className="azure-modal-overlay">
          <div className="azure-modal">
            <div className="azure-modal-header">
              <div className="flex items-center azure-gap-sm">
                <Search className="w-6 h-6 text-muted-foreground" />
                <h3 className="text-lg font-semibold text-card-foreground">
                  Column Not Found
                </h3>
              </div>
            </div>
            <div className="azure-modal-body">
              <p className="text-muted-foreground azure-mb-md">
                The column part number <span className="font-mono bg-surface-secondary azure-space-xs rounded">{searchValue}</span> was not found in our system.
              </p>
              <div className="bg-info/10 border border-info/20 rounded-lg azure-space-sm">
                <p className="text-sm text-info">
                  <strong>Tip:</strong> Try searching for COL, A6X, US2, or 2021 part numbers for column configurations.
                </p>
              </div>
            </div>
            <div className="azure-modal-footer">
              <button
                onClick={() => setShowNotFoundModal(false)}
                className="azure-btn-secondary"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowNotFoundModal(false);
                  setSearchValue("");
                  searchInputRef.current?.focus();
                }}
                className="azure-btn-primary"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Azure Spare Part Not Found Modal */}
      {showSparePartNotFoundModal && (
        <div className="azure-modal-overlay">
          <div className="azure-modal">
            <div className="azure-modal-header">
              <div className="flex items-center azure-gap-sm">
                <Search className="w-6 h-6 text-muted-foreground" />
                <h3 className="text-lg font-semibold text-card-foreground">
                  Spare Part Not Found
                </h3>
              </div>
            </div>
            <div className="azure-modal-body">
              <p className="text-muted-foreground azure-mb-md">
                The spare part <span className="font-mono bg-surface-secondary azure-space-xs rounded">{searchValue}</span> was not found in our inventory.
              </p>
              <div className="bg-info/10 border border-info/20 rounded-lg azure-space-sm">
                <p className="text-sm text-info">
                  <strong>Suggestion:</strong> Please verify the part number format and try again, or browse our parts catalog.
                </p>
              </div>
            </div>
            <div className="azure-modal-footer">
              <button
                onClick={() => setShowSparePartNotFoundModal(false)}
                className="azure-btn-secondary"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowSparePartNotFoundModal(false);
                  setSearchValue("");
                  searchInputRef.current?.focus();
                }}
                className="azure-btn-primary"
              >
                Search Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;