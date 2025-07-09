import { useState } from "react";
import { Settings, RefreshCw, X, AlertCircle, Calculator, Search, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { showToast } from "../../lib/toast-utils";

import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";

import SearchListViewPage from "./SearchListViewPage";
import Filterbox from "../../components/FilterBox/Filterbox";
import MLFB from "../../components/MLFB/MLFB";
import Possibilities from "../../components/FilterBox/Possibilities";

function SearchPage() {
  const [searchFilter, setSearchFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [MLFBArray, setMLFBArray] = useState([]);
  const [options, setOptions] = useState([]);
  const [parsedConfiguration, setParsedConfiguration] = useState([]);
  const [showNotFoundModal, setShowNotFoundModal] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [partNumberOptions, setPartNumberOptions] = useState([]);
  const [partNumber, setPartNumber] = useState("");
  const [searchByCOL, setSearchByCOL] = useState(false);
  const [generateConfiguration, setGenerateConfiguration] = useState([]);
  const [price, setPrice] = useState();
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);

  function getData(data) {
    console.log(data);
    setSearchFilter(data);
    setSearchByCOL(true);
  }


  function getParsedInformation(data) {
    console.log(data);
    setParsedConfiguration(data);
    console.log(parsedConfiguration);
  }

  function getConfigurations(data) {
    console.log(data);
  }

  function handleFinalConfiguration(data) {
    console.log("🔧 handleFinalConfiguration received data:", data);
    console.log("🔧 Current partNumberOptions:", partNumberOptions);

    // Don't duplicate the partNumberOptions - FilterBox already combines them correctly
    const finalConfiguration = data;

    if (partNumberOptions.length > 0) {
      console.log("📝 Using API-assisted configuration");
      generatePartNumber(finalConfiguration);
    } else {
      console.log("📝 Using manual configuration");
      // For manual configuration, remove first 3 items (they're just placeholders)
      const configForPartNumber = [...finalConfiguration];
      configForPartNumber.shift();
      configForPartNumber.shift();
      configForPartNumber.shift();
      console.log("📝 Configuration for part number:", configForPartNumber);
      generatePartNumber(configForPartNumber);
    }

    // Generate MLFB array from the final configuration
    setMLFBArray([]);
    finalConfiguration.forEach((option) => {
      setMLFBArray((oldArray) => [...oldArray, option.code]);
    });
    setGenerateConfiguration(finalConfiguration);
    generatePricing(finalConfiguration);
  }

  async function generatePartNumber(partNumberOptions) {
    try {
      const response = await fetch(
        "https://wea-spt-use-dv-configurationsapi-001.azurewebsites.net/v1/configurations/generatePartNumber",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(partNumberOptions),
        }
      )
        .then((response) => response.json())
        .then((parsedJSON) => setPartNumber(parsedJSON.result));
    } catch (e) {
      //setError(e)
    } finally {
      setIsLoading(false);
    }
  }

  async function generatePricing(options) {
    try {
      const response = await fetch(
        "https://wea-spt-use-dv-pricingapi-001.azurewebsites.net/packedColumnPricing",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ options }),
        }
      )
        .then((response) => response.json())
        .then((parsedJSON) => setPrice(parsedJSON.result));
    } catch (e) {
      //setError(e)
    } finally {
      setIsLoading(false);
    }
  }

  const handleResetConfiguration = () => {
    console.log("🔄 Resetting entire configuration");
    
    // Reset all SearchPage state
    setShowConfigPanel(false);
    setPartNumberOptions([]);
    setMLFBArray([]);
    setGenerateConfiguration([]);
    setPartNumber("");
    setPrice(undefined);
    setSearchFilter("");
    setSearchTerm("");
    
    // Trigger FilterBox reset
    setResetTrigger(prev => prev + 1);
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      setIsLoading(true);
      try {
        // Check if the search term is a column part number (contains COL, A6X, US2, or 2021)
        if (
          searchTerm.trim().toUpperCase().includes('COL') ||
          searchTerm.trim().toUpperCase().includes('A6X') ||
          searchTerm.trim().toUpperCase().includes('US2') ||
          searchTerm.trim().toUpperCase().includes('2021')
        ) {
          // Use the correct endpoint for packed column search
          const response = await fetch(
            `https://wea-spt-use-dv-configurationsapi-001.azurewebsites.net/v1/configurations/getPackedColumn?partNumber=${searchTerm.trim()}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          
          if (response.ok) {
            const data = await response.json();
            console.log("🔍 API Response for", searchTerm, ":", data);
            console.log("🔍 Result object:", data.result);
            console.log("🔍 Options array:", data.result?.options);
            console.log("🔍 Options length:", data.result?.options?.length);
            
            // Handle the new API structure: data.result.options
            if (data.result && data.result.options && Array.isArray(data.result.options) && data.result.options.length > 0) {
              // Log each option for debugging
              data.result.options.forEach((option, index) => {
                console.log(`📌 Option ${index + 1}:`, option);
              });
              
              // Set the parsed configuration options
              setPartNumberOptions(data.result.options);
              setShowConfigPanel(true);
              setSearchFilter(searchTerm.trim());
              console.log("✅ Column configuration loaded successfully");
              
              // Show success toast
              showToast.success(`Configuration loaded for ${searchTerm}`, {
                title: "Configuration Found"
              });
              
              // Handle any errors in the response
              if (data.result.errors && data.result.errors.length > 0) {
                console.warn("⚠️ API returned errors:", data.result.errors);
                showToast.warning("Configuration loaded with some warnings", {
                  title: "Partial Configuration"
                });
              }
            } else {
              // No configuration found, show not found modal
              setShowNotFoundModal(true);
              setSearchFilter(searchTerm.trim());
              showToast.error(`No configuration found for ${searchTerm}`, {
                title: "Configuration Not Found"
              });
            }
          } else {
            // API error, show not found modal
            setShowNotFoundModal(true);
            setSearchFilter(searchTerm.trim());
            showToast.error("Failed to load configuration", {
              title: "API Error"
            });
          }
        } else {
          // Not a column part number, do regular search
          getData(searchTerm.trim());
          setSearchFilter(searchTerm.trim());
        }
      } catch (error) {
        console.error("Error searching for column:", error);
        setShowNotFoundModal(true);
        setSearchFilter(searchTerm.trim());
        showToast.error("An error occurred while searching", {
          title: "Search Error"
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClearSearch = () => {
    console.log("🔄 Clearing search");
    
    setSearchTerm("");
    setSearchFilter("");
    setShowConfigPanel(false);
    setPartNumberOptions([]);
    setMLFBArray([]);
    setGenerateConfiguration([]);
    setPartNumber("");
    setPrice(undefined);
    
    // Also trigger FilterBox reset
    setResetTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header Section */}
      <div className="bg-gradient-to-r from-background via-muted/20 to-background border-b">
        <div className="container mx-auto px-6 py-6">
          <div className="max-w-5xl mx-auto text-center mb-6">
            <div className="inline-flex items-center space-x-3 mb-4">
              <h1 className="text-2xl font-bold text-foreground">Column Configurator</h1>
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
                    placeholder="Search Part Number Ex: 'COL1044'"
                    className="flex-1 py-3 pr-16 text-base text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-transparent focus:outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchTerm.trim()) {
                        handleSearch();
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
                    {(searchTerm || searchFilter) && (
                      <button
                        onClick={handleClearSearch}
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

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
            {totalItems > 0 && (
              <div className="flex items-center space-x-2 px-4 py-2 bg-card border rounded-lg shadow-sm">
                <span className="text-sm font-medium text-foreground">
                  {totalItems.toLocaleString()} configurations {showConfigPanel ? 'found' : 'available'}
                </span>
              </div>
            )}
            
            {showConfigPanel && (
              <button
                onClick={handleResetConfiguration}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-lg"
              >
                <RefreshCw className="w-4 h-4" />
                Reset Configuration
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Configuration Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              
              {/* Configuration Form */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Settings className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">
                        MAXUM Configuration
                      </CardTitle>
                    </div>
                    {(showConfigPanel || partNumberOptions.length > 0) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleResetConfiguration}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="p-3 overflow-hidden">
                  <Filterbox
                    setMLFBArray={setMLFBArray}
                    setOptions={setOptions}
                    setConfiguration={getConfigurations}
                    partNumberOptions={partNumberOptions}
                    setPartNumberOptions={setPartNumberOptions}
                    setGenerateConfiguration={handleFinalConfiguration}
                    resetTrigger={resetTrigger}
                  />
                </CardContent>
              </Card>

             
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Configuration Loaded Status */}
            {showConfigPanel && searchFilter.toUpperCase().startsWith('COL') && partNumberOptions.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-sm text-muted-foreground">
                      Configuration loaded for <span className="font-medium text-foreground">{searchFilter}</span>
                      {partNumberOptions.length === 7 ? " - Complete configuration found" : " - Partial configuration found, please select first 3 options"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* MLFB Code Display */}
            {MLFBArray.length > 0 && (
              <MLFB mlfbCode={MLFBArray} />
            )}

            {/* Configuration Results */}
            {(partNumber || price || generateConfiguration.length > 0) && (
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Calculator className="h-5 w-5 text-primary" />
                    <CardTitle>Configuration Results</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Possibilities
                    data={searchFilter}
                    selectedOptions={options}
                    setMLFBArray={setMLFBArray}
                    mlfbCode={MLFBArray}
                    finalConfig={generateConfiguration}
                    partNumber={partNumber}
                    price={price}
                  />
                </CardContent>
              </Card>
            )}

            {/* Search Results */}
            {searchFilter && !showConfigPanel && !searchFilter.toUpperCase().startsWith('COL') && (
              <Card>
                <CardHeader>
                  <CardTitle>Search Results</CardTitle>
                  <CardDescription>
                    Showing results for "{searchFilter}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SearchListViewPage search={searchFilter} />
                </CardContent>
              </Card>
            )}

            {/* Empty State */}
            {!searchFilter && !showConfigPanel && MLFBArray.length === 0 && !partNumber && (
              <Card>
                <CardContent className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                    <Settings className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Welcome to Column Configurator
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-8">
                    Use the configuration panel on the left to build your custom column, or search for a specific column part number above.
                  </p>
                  
                  {/* Feature highlights */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg mx-auto">
                    <div className="text-left">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm font-medium">Smart Configuration</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Intelligent part selection and validation
                      </p>
                    </div>
                    <div className="text-left">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm font-medium">Real-time Pricing</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Instant cost calculations and updates
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Column Not Found Modal */}
      <AlertDialog open={showNotFoundModal} onOpenChange={setShowNotFoundModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-6 w-6 text-destructive" />
              <AlertDialogTitle>Column Not Found</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              No column was found matching the part number "{searchFilter}".
              Please check the part number and try again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNotFoundModal(false)}
            >
              Close
            </Button>
            <AlertDialogAction
              onClick={() => {
                setShowNotFoundModal(false);
                setSearchFilter("");
              }}
            >
              Search Again
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default SearchPage;