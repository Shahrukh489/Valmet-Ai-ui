import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import MyPagination from "./MyPagination";
import PartsFilter from "./PartsFilter";
import SparePartsFilter from "../../components/SparePartsFilter/SparePartsFilter";
import SparePartListItem from "./SparePartListItem";
import SearchBar from "../../components/SearchBarComp/SearchBar";
import ListView from "./ListView";
import { List, Search, Filter as FilterIcon, Settings, X, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";

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
  const [showNoResultsModal, setShowNoResultsModal] = useState(false);

  const SPAREPARTSAPI_BASE_URL =
    "https://wea-spt-use-dv-sparepartsapi-001.azurewebsites.net";

  const fetchParts = async (page = 1) => {
    console.log("📥 fetchParts called for page:", page);
    setIsLoading(true);
    try {
      const response = await fetch(
        `${SPAREPARTSAPI_BASE_URL}/v1/spareparts/api/spareparts/GetSpareParts?pageNumber=${page}&pageSize=15`
      );
      const parts = await response.json();
      console.log("📥 Fetched parts:", parts.result.data.length);
      
      // Log some example part numbers to understand the format
      if (parts.result.data.length > 0) {
        console.log("🔧 Sample part numbers:", 
          parts.result.data.slice(0, 5).map(part => ({
            partNumber: part.partnumber,
            description: part.description,
            mlfb: part.mlfb
          }))
        );
      }
      
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
    console.log("⚡ useEffect triggered - isFiltered:", isFiltered, "currentPage:", currentPage);
    if (!isFiltered) {
      console.log("📥 Calling fetchParts from useEffect");
      fetchParts(currentPage);
    } else {
      console.log("🚫 Skipping fetchParts - currently filtered");
    }
  }, [currentPage, isFiltered]);

  const handleFilteringGC = async (searchTerm, page = 1) => {
    setIsLoading(true);
    try {
      console.log("Filtering by GC number:", searchTerm, "Page:", page);
      const response = await fetch(
        `${SPAREPARTSAPI_BASE_URL}/v1/spareparts/api/spareparts/SearchSparePartsByGC?gcNumber=${encodeURIComponent(searchTerm)}&pageNumber=${page}&pageSize=10`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("GC Filter API response:", result);
      
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
  console.log("🎯 RENDER STATE:");
  console.log("  - partsToDisplay length:", partsToDisplay?.length || 0);
  console.log("  - isFiltered:", isFiltered);
  console.log("  - activeSearchTerm:", activeSearchTerm);
  console.log("  - searchTerm:", searchTerm);
  console.log("  - isLoading:", isLoading);
  console.log("  - totalItems:", totalItems);
  console.log("  - displayedParts:", displayedParts);

  // Handle search functionality
  const handleSearch = async (searchTermInput) => {
    const searchTerm = typeof searchTermInput === 'string' ? searchTermInput : searchTermInput.trim ? searchTermInput.trim() : String(searchTermInput);
    
    if (!searchTerm) {
      handleResetSearch();
      return;
    }
    
    console.log("🔍 Starting comprehensive search for:", searchTerm);
    setSearchTerm(searchTerm);
    setIsLoading(true);
    
    // Reset filter states to start fresh
    setIsFilterDropdownActive(false);
    
    try {
      let foundResults = [];
      let searchMethod = "";
      
      // Method 1: Try GC number search first if it looks like a GC number
      const isGCNumber = /^[PGpg]\d+/i.test(searchTerm);
      if (isGCNumber) {
        console.log("🏷️ Method 1: Trying GC number search:", searchTerm);
        try {
          const gcResponse = await fetch(
            `${SPAREPARTSAPI_BASE_URL}/v1/spareparts/api/spareparts/SearchSparePartsByGC?gcNumber=${encodeURIComponent(searchTerm)}&pageNumber=1&pageSize=50`
          );
          if (gcResponse.ok) {
            const gcResult = await gcResponse.json();
            const gcData = gcResult.result?.data || [];
            if (gcData.length > 0) {
              foundResults = gcData;
              searchMethod = "GC Number";
              console.log("✅ Found via GC search:", gcData.length, "parts");
            }
          }
        } catch (gcError) {
          console.log("⚠️ GC search failed:", gcError.message);
        }
      }
      
      // Method 2: Try general search if no GC results
      if (foundResults.length === 0) {
        console.log("🔧 Method 2: Trying general search:", searchTerm);
        try {
          const generalResponse = await fetch(
            `${SPAREPARTSAPI_BASE_URL}/v1/spareparts/api/spareparts/SearchSpareParts?searchTerm=${encodeURIComponent(searchTerm)}&pageNumber=1&pageSize=50`
          );
          if (generalResponse.ok) {
            const generalResult = await generalResponse.json();
            const generalData = generalResult.result?.data || [];
            if (generalData.length > 0) {
              foundResults = generalData;
              searchMethod = "General Search";
              console.log("✅ Found via general search:", generalData.length, "parts");
            }
          }
        } catch (generalError) {
          console.log("⚠️ General search failed:", generalError.message);
        }
      }
      
      // Method 3: Try client-side filtering as fallback
      if (foundResults.length === 0 && partsList.length > 0) {
        console.log("🔍 Method 3: Trying client-side search in", partsList.length, "parts");
        const clientResults = partsList.filter(part => {
          const partNumber = (part.partnumber || "").toLowerCase();
          const description = (part.description || "").toLowerCase();
          const mlfb = (part.mlfb || "").toLowerCase();
          const searchLower = searchTerm.toLowerCase();
          
          return partNumber.includes(searchLower) || 
                 description.includes(searchLower) || 
                 mlfb.includes(searchLower);
        });
        
        if (clientResults.length > 0) {
          foundResults = clientResults;
          searchMethod = "Client-side Filter";
          console.log("✅ Found via client-side search:", clientResults.length, "parts");
        }
      }
      
      // Display results or show no results modal
      if (foundResults.length === 0) {
        console.log("❌ No results found with any method for:", searchTerm);
        setShowNoResultsModal(true);
        setActiveSearchTerm(searchTerm);
        // Reset to show original parts list
        setIsFiltered(false);
        setDisplayedParts(partsList);
        setCurrentPage(1);
        setCurrentFilteredPage(1);
        setTotalPages(Math.ceil(partsList.length / 15) || 1);
        setTotalItems(partsList.length);
      } else {
        console.log(`✅ Search successful via ${searchMethod}:`, foundResults.length, "parts");
        console.log("📋 First result:", foundResults[0]);
        
        // Set search results
        setActiveSearchTerm(searchTerm);
        setFilteredPartsList(foundResults);
        setIsFiltered(true);
        setIsGCSearch(isGCNumber && searchMethod === "GC Number");
        setCurrentFilteredPage(1);
        setCurrentPage(1);
        setTotalPages(Math.ceil(foundResults.length / 15) || 1);
        setTotalItems(foundResults.length);
        setShowNoResultsModal(false);
        
        // Set displayed parts
        setDisplayedParts([...foundResults]);
        
        console.log("🎯 State updated - displaying:", foundResults.length, "parts via", searchMethod);
      }
    } catch (error) {
      console.error("❌ Error in search process:", error);
      setShowNoResultsModal(true);
      setActiveSearchTerm(searchTerm);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset search and filters
  const handleResetSearch = () => {
    console.log("🔄 Resetting search");
    setSearchTerm("");
    setActiveSearchTerm("");
    setIsFiltered(false);
    setIsGCSearch(false);
    setIsFilterDropdownActive(false);
    setCurrentPage(1);
    setCurrentFilteredPage(1);
    setShowNoResultsModal(false);
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
              <h1 className="text-2xl font-bold text-foreground">Spare Parts Search</h1>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                {/* Modern Search Container */}
                <div className="relative flex items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md focus-within:shadow-md focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-900/30">
                  {/* Search Icon */}
                  <div className="pl-4 pr-3">
                    <Search className="h-5 w-5 text-gray-400 transition-colors duration-200" />
                  </div>
                  
                  {/* Search Input */}
                  <input
                    type="text"
                    placeholder="Search by part number, description, or GC number..."
                    className="flex-1 py-3 pr-16 text-base text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-transparent focus:outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchTerm.trim()) {
                        handleSearch(searchTerm.trim());
                      }
                    }}
                  />
                  
                  {/* Action Buttons */}
                  <div className="flex items-center pr-3 gap-1">
                    {/* Loading Indicator */}
                    {isLoading && (
                      <div className="p-1.5">
                        <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                      </div>
                    )}
                    
                    {/* Clear Button */}
                    {(searchTerm || isFiltered) && (
                      <button
                        onClick={handleResetSearch}
                        className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        title="Clear search"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
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
                        {activeSearchTerm && (
                          <span className="ml-2 px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                            for "{activeSearchTerm}"
                          </span>
                        )}
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

    {/* No Results Modal */}
    <Dialog open={showNoResultsModal} onOpenChange={setShowNoResultsModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            No Parts Found
          </DialogTitle>
          <DialogDescription className="text-center py-4">
            No spare parts were found matching your search criteria for "{activeSearchTerm || searchTerm}".
            <br />
            <br />
            Please try:
            <ul className="text-left mt-2 space-y-1">
              <li>• Checking your spelling</li>
              <li>• Using different keywords</li>
              <li>• Using the filter options</li>
              <li>• Searching with a partial part number</li>
            </ul>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          <Button 
            onClick={() => {
              setShowNoResultsModal(false);
              setSearchTerm("");
              handleResetSearch();
            }}
            className="w-full"
          >
            Close and Clear Search
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </div>
  );
}

export default SearchParts;
