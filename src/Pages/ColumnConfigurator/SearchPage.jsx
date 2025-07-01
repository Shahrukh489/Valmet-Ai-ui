import { useState } from "react";
import { Search, Settings, RefreshCw, X, AlertCircle, Calculator } from "lucide-react";
import { Link } from "react-router-dom";

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

import SearchBar from "../../components/SearchBarComp/SearchBar";
import SearchListViewPage from "./SearchListViewPage";
import Filterbox from "../../components/FilterBox/Filterbox";
import MLFB from "../../components/MLFB/MLFB";
import Possibilities from "../../components/FilterBox/Possibilities";

function SearchPage() {
  const [searchFilter, setSearchFilter] = useState("");
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

  function getData(data) {
    console.log(data);
    setSearchFilter(data);
    setSearchByCOL(true);
  }

  function getColumnNumberOptions(data) {
    console.log(data);
    if (data.length > 0) {
      setPartNumberOptions(data);
      setShowConfigPanel(true);
    } else {
      setShowNotFoundModal(true);
    }
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
    console.log(data);

    const newArr = [...data, ...partNumberOptions];

    if (partNumberOptions.length > 0) {
      console.log("here");
      generatePartNumber(partNumberOptions);
    } else {
      console.log("in else");
      data.shift();
      data.shift();
      data.shift();
      console.log(data);
      generatePartNumber(data);
    }

    setMLFBArray([]);
    newArr.forEach((option) => {
      setMLFBArray((oldArray) => [...oldArray, option.code]);
      console.log(MLFBArray);
    });
    setGenerateConfiguration(newArr);
    generatePricing(newArr);
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
    setShowConfigPanel(false);
    setPartNumberOptions([]);
    setMLFBArray([]);
    setGenerateConfiguration([]);
    setPartNumber("");
    setPrice(undefined);
    setSearchFilter("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header Section */}
      <div className="bg-gradient-to-r from-background via-muted/20 to-background border-b">
        <div className="container mx-auto px-6 py-6">
          <div className="max-w-5xl mx-auto text-center mb-6">
            <div className="inline-flex items-center space-x-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-foreground">
                  Column Configurator
                </h1>
                <p className="text-sm text-muted-foreground">
                  Design and configure MAXUM columns with intelligent pricing
                </p>
              </div>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <SearchBar
                getData={getData}
                getPreSetOptions={getColumnNumberOptions}
                placeholder="Search Part Number Ex: 'COL1044'"
              />
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
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-lg hover:bg-destructive/20 hover:border-destructive/30 transition-all duration-200"
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
                  />
                </CardContent>
              </Card>

              {/* Quick Stats */}
              {showConfigPanel && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-sm font-medium text-muted-foreground mb-2">
                        Configuration Status
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                        <span className="text-sm text-success font-medium">Active</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-3 space-y-6">
            
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
            {searchFilter && !showConfigPanel && (
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