import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import MyPagination from "./MyPagination";
import PartsFilter from "./PartsFilter";
import SparePartsFilter from "../../components/SparePartsFilter/SparePartsFilter";
import SparePartListItem from "./SparePartListItem";
import SearchBar from "../../components/SearchBarComp/SearchBar";
import ListView from "./ListView";
import { List, Search, Filter as FilterIcon, Settings, X } from "lucide-react";

function SearchParts() {
  const [isLoading, setIsLoading] = useState(false);
  const [partsList, setPartsList] = useState([]);
  const [filteredPartsList, setFilteredPartsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState([]);
  const [viewToggled, setViewToggled] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFilteredPage, setCurrentFilteredPage] = useState(1);
  const [isFiltered, setIsFiltered] = useState(false);
  const [isGCSearch, setIsGCSearch] = useState(false);
  const [isFilterDropdownActive, setIsFilterDropdownActive] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [displayedParts, setDisplayedParts] = useState([]);
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const [useNewFilter, setUseNewFilter] = useState(false); // Toggle between old and new filter

  const SPAREPARTSAPI_BASE_URL =
    "https://wea-spt-use-dv-sparepartsapi-001.azurewebsites.net";

  const fetchParts = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${SPAREPARTSAPI_BASE_URL}/v1/spareparts/api/spareparts/GetSpareParts?pageNumber=${page}&pageSize=15`
      );
      const parts = await response.json();
      setPartsList(parts.result.data);
      setDisplayedParts(parts.result.data);
      setTotalPages(parts.result.totalPages);
      setTotalItems(parts.result.totalItems);
    } catch (error) {
      console.error("Error fetching spare parts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterSubmitFromDropdown = async (formDataLocal, page = 1) => {
    setIsLoading(true);
    try {
      const formDataWithPaging = {
        ...formDataLocal,
        pageNumber: page,
        pageSize: 10,
      };

      const response = await fetch(
        `${SPAREPARTSAPI_BASE_URL}/v1/spareparts/filterSpareParts?pageNumber=${page}&pageSize=10`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDataWithPaging),
        }
      );

      const result = await response.json();
      const data = result.result.data || [];

      setFilteredPartsList(data);
      setDisplayedParts(data);
      setIsFilterDropdownActive(true);
      setIsFiltered(true);
      setCurrentFilteredPage(page);
      setTotalPages(result.result.totalPages || 1);
      setTotalItems(result.result.totalItems || data.length);
    } catch (error) {
      console.error("❌ Error submitting filter:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isFiltered) {
      fetchParts(currentPage);
    }
  }, [currentPage, isFiltered]);

  const handleFilteringGC = async (searchTerm, page = 1) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${SPAREPARTSAPI_BASE_URL}/v1/spareparts/api/spareparts/SearchSparePartsByGC?gcNumber=${encodeURIComponent(searchTerm)}&pageNumber=${page}&pageSize=10`
      );
      const result = await response.json();
      const data = result.result?.data || [];
      
      setFilteredPartsList(data);
      setDisplayedParts(data);
      setIsFiltered(true);
      setIsGCSearch(true);
      setCurrentFilteredPage(page);
      setTotalPages(result.result?.totalPages || 1);
      setTotalItems(result.result?.totalItems || data.length);
      setActiveSearchTerm(searchTerm);
    } catch (error) {
      console.error("Error searching by GC:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (isFiltered && isGCSearch) {
      handleFilteringGC(activeSearchTerm, newPage);
    } else if (isFilterDropdownActive) {
      handleFilterSubmitFromDropdown(formData, newPage);
    } else {
      setCurrentPage(newPage);
    }
  };

  const partsToDisplay = displayedParts;
  console.log("partsToDisplay", partsToDisplay);

  // Handle search functionality
  const handleSearch = async (searchTerm) => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    try {
      // Check if it's a GC number search (contains letters and numbers)
      const isGCNumber = /^[A-Za-z0-9]+$/.test(searchTerm) && /[A-Za-z]/.test(searchTerm);
      
      let response;
      if (isGCNumber) {
        response = await fetch(
          `${SPAREPARTSAPI_BASE_URL}/v1/spareparts/api/spareparts/SearchSparePartsByGC?gcNumber=${encodeURIComponent(searchTerm)}&pageNumber=1&pageSize=15`
        );
        setIsGCSearch(true);
      } else {
        // Search by part number or description
        response = await fetch(
          `${SPAREPARTSAPI_BASE_URL}/v1/spareparts/api/spareparts/SearchSpareParts?searchTerm=${encodeURIComponent(searchTerm)}&pageNumber=1&pageSize=15`
        );
        setIsGCSearch(false);
      }
      
      const result = await response.json();
      const data = result.result?.data || [];
      
      setFilteredPartsList(data);
      setDisplayedParts(data);
      setIsFiltered(true);
      setCurrentFilteredPage(1);
      setTotalPages(result.result?.totalPages || 1);
      setTotalItems(result.result?.totalItems || data.length);
      setActiveSearchTerm(searchTerm);
    } catch (error) {
      console.error("Error searching parts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset search and filters
  const handleResetSearch = () => {
    setSearchTerm("");
    setActiveSearchTerm("");
    setIsFiltered(false);
    setIsGCSearch(false);
    setIsFilterDropdownActive(false);
    setCurrentPage(1);
    setCurrentFilteredPage(1);
    fetchParts(1);
  };

  // Handle new filter changes
  const handleNewFilterChange = (filters) => {
    console.log("New filters applied:", filters);
    // Here you would typically make an API call with the new filters
    // For now, we'll just log the filters
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header Section */}
      <div className="bg-gradient-to-r from-background via-muted/20 to-background border-b">
        <div className="container mx-auto px-6 py-6">
          <div className="max-w-5xl mx-auto text-center mb-6">
            <div className="inline-flex items-center space-x-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-foreground">
                  Spare Parts Search
                </h1>
                <p className="text-sm text-muted-foreground">
                  Find and manage industrial spare parts efficiently
                </p>
              </div>
            </div>
            
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Search by part number, description, or GC number..."
                className="w-full h-10 pl-12 pr-12 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && searchTerm.trim()) {
                    handleSearch(searchTerm.trim());
                  }
                }}
              />
              {(searchTerm || isFiltered) && (
                <button
                  onClick={handleResetSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          </div>
        </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-6">
          {/* Filter Sidebar */}
          <div className="w-80 flex-shrink-0">
            <div className="card sticky top-4">
              <PartsFilter
                setFormData={setFormData}
                getSearchValue={setSearchTerm}
                onFilterResult={(apiResult, page) => {
                  const data = apiResult?.result?.data || [];
                  setFilteredPartsList(data);
                  setDisplayedParts(data);
                  setIsFilterDropdownActive(true);
                  setIsFiltered(true);
                  setCurrentFilteredPage(page);
                  setTotalPages(apiResult?.result?.totalPages || 1);
                  setTotalItems(apiResult?.result?.totalItems || data.length);
                }}
                onSubmitFilter={handleFilterSubmitFromDropdown}
              />
            </div>
          </div>

          {/* Results Section */}
          <div className="flex-1">
            <div className="card">
              {/* Results Header */}
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {totalItems > 0 && (
                      <span className="text-sm text-muted-foreground">
                        Showing {(isFiltered ? (currentFilteredPage - 1) * 10 + 1 : (currentPage - 1) * 15 + 1)}–
                        {Math.min(isFiltered ? currentFilteredPage * 10 : currentPage * 15, totalItems)} of {totalItems} results
                      </span>
                    )}
                  </div>
                  
                  <MyPagination
                    currentPage={isFiltered ? currentFilteredPage : currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>

              {/* Results Content */}
              <div className="px-6 py-8">
                {isLoading ? (
                  <div className="flex justify-center items-center py-24">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-3 text-muted-foreground">Loading spare parts...</span>
                  </div>
                ) : partsToDisplay.length === 0 ? (
                  <div className="text-center py-24">
                    <div className="w-24 h-24 mx-auto mb-6 bg-surface-secondary rounded-full flex items-center justify-center">
                      <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-card-foreground mb-3">No parts found</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Try adjusting your search terms or filters to find what you're looking for.
                    </p>
                  </div>
                ) : (
                  <div className="gap-2 flex flex-col">
                    {partsToDisplay.map((part, idx) => (
                      <ListView
                        key={`${part.partnumber}-${idx}`}
                        id={part.partnumber}
                        name={part.description}
                        partNumber={part.partnumber}
                        price={part.price ? parseFloat(part.price) : 0}
                        mlfb={part.mlfb}
                        itemCategory={part.itemCategory}
                        productCategory={part.productCategory}
                        subProductCategory={part.subProductCategory}
                        note={part.note}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default SearchParts;
