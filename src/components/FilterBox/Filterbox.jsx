import { useState, useEffect } from "react";
import { RefreshCw, Zap, Loader2 } from "lucide-react";

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { cn } from "../../lib/utils";

const BASE_URL = "https://wea-spt-use-dv-configurationsapi-001.azurewebsites.net/";

function Filterbox(props) {
  const [options, setOptions] = useState([]);
  const [originalOptions, setOriginalOptions] = useState([]); // Store original options
  const [filters, setFilters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Selection states
  const [diameterDisabled, setDiameterDisabled] = useState(false);
  const [lengthDisabled, setLengthDisabled] = useState(true);
  const [tubingDisabled, setTubingDisabled] = useState(true);
  const [meshDisabled, setMeshDisabled] = useState(true);
  const [liquidDisabled, setLiquidDisabled] = useState(true);
  const [loadDisabled, setLoadDisabled] = useState(true);
  const [fillingDisabled, setFillingDisabled] = useState(true);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  // Form values
  const [selectedDiameter, setSelectedDiameter] = useState("");
  const [selectedLength, setSelectedLength] = useState("");
  const [selectedTubing, setSelectedTubing] = useState("");
  const [selectedMesh, setSelectedMesh] = useState("");
  const [selectedFilling, setSelectedFilling] = useState("");
  const [selectedLiquid, setSelectedLiquid] = useState("");
  const [selectedLoad, setSelectedLoad] = useState("");

  const [mlfbArray, setMLFBArray] = useState([]);
  const [formData, setFormData] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_URL}v1/configurations`);
        const options = await response.json();
        console.log("🔄 Full API response:", options);
        console.log("🔄 Options result:", options.result);
        console.log("📊 Group codes available:", [...new Set(options.result?.map(o => o.groupCode))]);
        console.log("🏭 Filling material options (group 12):", options.result?.filter(o => o.groupCode === "12"));
        console.log("🧪 Sample option structure:", options.result?.[0]);
        
        if (options.result && Array.isArray(options.result)) {
          setOptions(options.result);
          setOriginalOptions(options.result); // Store original options
        } else {
          console.error("❌ Invalid options data structure:", options);
        }

        const filtersResponse = await fetch(`${BASE_URL}v1/configurations/filters`);
        const filters = await filtersResponse.json();
        setFilters(filters.result);
      } catch (e) {
        console.error("Error fetching options:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOptions();
  }, []);

  // Reset effect - trigger when reset prop changes
  useEffect(() => {
    if (props.resetTrigger) {
      console.log("🔄 Reset triggered from parent");
      confirmRestart();
    }
  }, [props.resetTrigger]);

  useEffect(() => {
    console.log("🎆 FilterBox received partNumberOptions:", props.partNumberOptions);
    console.log("🎆 Length:", props.partNumberOptions.length);
    
    if (props.partNumberOptions.length > 0) {
      if (props.partNumberOptions.length === 7) {
        console.log("📦 Full configuration (7 options) - populating all dropdowns");
        
        // Full configuration found - set all dropdowns but leave first 3 enabled for user modification
        setSelectedDiameter(props.partNumberOptions[0]?.id?.toString() || "");
        setSelectedLength(props.partNumberOptions[1]?.id?.toString() || "");
        setSelectedTubing(props.partNumberOptions[2]?.id?.toString() || "");
        setSelectedMesh(props.partNumberOptions[3]?.id?.toString() || "");
        setSelectedFilling(props.partNumberOptions[4]?.id?.toString() || "");
        setSelectedLiquid(props.partNumberOptions[5]?.id?.toString() || "");
        setSelectedLoad(props.partNumberOptions[6]?.id?.toString() || "");
        
        console.log("🎆 Set values:", {
          diameter: props.partNumberOptions[0]?.id,
          length: props.partNumberOptions[1]?.id,
          tubing: props.partNumberOptions[2]?.id,
          mesh: props.partNumberOptions[3]?.id,
          filling: props.partNumberOptions[4]?.id,
          liquid: props.partNumberOptions[5]?.id,
          load: props.partNumberOptions[6]?.id
        });
        
        // Force a re-render to ensure dropdowns update
        setTimeout(() => {
          console.log("🔄 Forcing dropdown update for full config");
          setSelectedMesh(props.partNumberOptions[3]?.id?.toString() || "");
          setSelectedFilling(props.partNumberOptions[4]?.id?.toString() || "");
          setSelectedLiquid(props.partNumberOptions[5]?.id?.toString() || "");
          setSelectedLoad(props.partNumberOptions[6]?.id?.toString() || "");
        }, 100);
        
        // Keep first 3 enabled for user selection, last 4 are from API
        setDiameterDisabled(false);
        setLengthDisabled(false);
        setTubingDisabled(false);
        setMeshDisabled(true);
        setFillingDisabled(true);
        setLiquidDisabled(true);
        setLoadDisabled(true);
        setButtonDisabled(false);
        
        // Set form data for the last 4 options from API
        const lastFourOptions = props.partNumberOptions.slice(3);
        setFormData(lastFourOptions);
        
        // Don't generate MLFB codes yet - wait for user selections
        setMLFBArray([]);
      } else if (props.partNumberOptions.length === 4) {
        console.log("📦 Partial configuration (4 options) - populating last 4 dropdowns");
        
        // Partial configuration found - populate last 4 dropdowns only
        const lastFour = props.partNumberOptions;
        console.log("🎆 Last four options:", lastFour);
        
        setSelectedMesh(lastFour[0]?.id?.toString() || "");
        setSelectedFilling(lastFour[1]?.id?.toString() || "");
        setSelectedLiquid(lastFour[2]?.id?.toString() || "");
        setSelectedLoad(lastFour[3]?.id?.toString() || "");
        
        console.log("🎆 Set last 4 values:", {
          mesh: lastFour[0]?.id,
          filling: lastFour[1]?.id,
          liquid: lastFour[2]?.id,
          load: lastFour[3]?.id
        });
        
        // Force a re-render to ensure dropdowns update
        setTimeout(() => {
          console.log("🔄 Forcing dropdown update");
          setSelectedMesh(lastFour[0]?.id?.toString() || "");
          setSelectedFilling(lastFour[1]?.id?.toString() || "");
          setSelectedLiquid(lastFour[2]?.id?.toString() || "");
          setSelectedLoad(lastFour[3]?.id?.toString() || "");
        }, 100);
        
        // Enable first 3 for user selection, pre-populate last 4
        setDiameterDisabled(false);
        setLengthDisabled(true); // Will be enabled when diameter is selected
        setTubingDisabled(true); // Will be enabled when length is selected
        setMeshDisabled(true);
        setFillingDisabled(true);
        setLiquidDisabled(true);
        setLoadDisabled(true);
        
        // Set form data for the last 4 options
        setFormData(lastFour);
        
        // Don't generate MLFB codes yet - wait for user selections
        setMLFBArray([]);
      } else {
        console.log("⚠️ Unexpected number of options:", props.partNumberOptions.length);
      }
    } else {
      console.log("🔄 No partNumberOptions provided, resetting to manual configuration");
    }
  }, [props.partNumberOptions]);

  useEffect(() => {
    const setMLFB = async () => {
      if (mlfbArray.length === 0) return;
      
      try {
        let finalMLFBString = "";
        
        if (props.partNumberOptions.length >= 4) {
          // Build the MLFB string manually for hybrid workflow
          // Format: 7KQ2908-[user selections]-[API options]
          const baseCode = "7KQ2908";
          const userSelections = mlfbArray.join(""); // Diameter, Length, Tubing
          const apiOptions = props.partNumberOptions.length === 7 
            ? props.partNumberOptions.slice(3).map(opt => opt.code).join("+")
            : props.partNumberOptions.slice(-4).map(opt => opt.code).join("+");
          
          finalMLFBString = `${baseCode}-${userSelections}-${apiOptions}`;
          props.setMLFBArray(finalMLFBString);
        } else {
          // Standard workflow - use API to generate
          const response = await fetch(
            "https://wea-spt-use-dv-configurationsapi-001.azurewebsites.net/generateMLFBString",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(mlfbArray),
            }
          );
          const parsedJSON = await response.json();
          props.setMLFBArray(parsedJSON.result);
        }
      } catch (e) {
        console.error("Error generating MLFB:", e);
      }
    };
    setMLFB();
  }, [mlfbArray, props.partNumberOptions]);

  const handleSubmit = (event) => {
    event.preventDefault();
    
    console.log("🚀 handleSubmit called");
    console.log("🚀 partNumberOptions.length:", props.partNumberOptions.length);
    console.log("🚀 Selected values:", {
      diameter: selectedDiameter,
      length: selectedLength,
      tubing: selectedTubing,
      mesh: selectedMesh,
      filling: selectedFilling,
      liquid: selectedLiquid,
      load: selectedLoad
    });
    
    // If we have pre-populated options from API, combine user selections with API options
    if (props.partNumberOptions.length >= 4) {
      const userSelections = [];
      
      // Add user selections if they exist
      if (selectedDiameter) {
        const diameterOption = options.find(o => o.id === parseInt(selectedDiameter));
        if (diameterOption) userSelections.push(diameterOption);
      }
      if (selectedLength) {
        const lengthOption = options.find(o => o.id === parseInt(selectedLength));
        if (lengthOption) userSelections.push(lengthOption);
      }
      if (selectedTubing) {
        const tubingOption = options.find(o => o.id === parseInt(selectedTubing));
        if (tubingOption) userSelections.push(tubingOption);
      }
      
      // Get the last 4 options from API (these are already set in the component state)
      const lastFourOptions = [];
      if (selectedMesh) {
        const meshOption = props.partNumberOptions.find(o => o.id === parseInt(selectedMesh));
        if (meshOption) lastFourOptions.push(meshOption);
      }
      if (selectedFilling) {
        const fillingOption = props.partNumberOptions.find(o => o.id === parseInt(selectedFilling));
        if (fillingOption) lastFourOptions.push(fillingOption);
      }
      if (selectedLiquid) {
        const liquidOption = props.partNumberOptions.find(o => o.id === parseInt(selectedLiquid));
        if (liquidOption) lastFourOptions.push(liquidOption);
      }
      if (selectedLoad) {
        const loadOption = props.partNumberOptions.find(o => o.id === parseInt(selectedLoad));
        if (loadOption) lastFourOptions.push(loadOption);
      }
      
      const finalConfiguration = [...userSelections, ...lastFourOptions];
      console.log("🚀 Final configuration:", finalConfiguration);
      props.setGenerateConfiguration(finalConfiguration);
    } else {
      // Standard workflow - use formData as is
      console.log("🚀 Using standard workflow with formData:", formData);
      props.setGenerateConfiguration(formData);
    }
  };

  const changeHandler = (value) => {
    const optionId = parseInt(value);
    const option = options.find((o) => o.id === optionId);
    
    if (!option) return;

    handleConfiguration(option);
    handleDisables(option);
    mlfbHandler(option);
  };

  const mlfbHandler = (option) => {
    // For manual configuration (no API options), add all selections to MLFB array
    // For API-assisted configuration, only add user selections (first 3)
    if (props.partNumberOptions.length === 0) {
      // Manual configuration - add all options to MLFB array
      const newMLFBArray = [...mlfbArray, option.code];
      setMLFBArray(newMLFBArray);
    } else if (props.partNumberOptions.length > 0 && 
               (option.optionName === "Diameter" || option.optionName === "Length" || option.optionName === "Tubing")) {
      // API-assisted configuration - only add first 3 user selections
      const newMLFBArray = [...mlfbArray, option.code];
      setMLFBArray(newMLFBArray);
      
      // If this is the tubing selection and we have API options, generate MLFB immediately
      if (option.optionName === "Tubing" && props.partNumberOptions.length >= 4) {
        setTimeout(() => {
          const baseCode = "7KQ2908";
          const userSelections = newMLFBArray.join(""); // Diameter, Length, Tubing
          const apiOptions = props.partNumberOptions.length === 7 
            ? props.partNumberOptions.slice(3).map(opt => opt.code).join("+")
            : props.partNumberOptions.slice(-4).map(opt => opt.code).join("+");
          
          const finalMLFBString = `${baseCode}-${userSelections}-${apiOptions}`;
          props.setMLFBArray(finalMLFBString);
        }, 100);
      }
    }
  };

  const handleRestart = () => {
    setShowConfirmDialog(true);
  };

  const confirmRestart = () => {
    console.log("🔄 Resetting FilterBox to initial state");
    
    // Reset all selection states
    setSelectedDiameter("");
    setSelectedLength("");
    setSelectedTubing("");
    setSelectedMesh("");
    setSelectedFilling("");
    setSelectedLiquid("");
    setSelectedLoad("");
    
    // Reset disable states to initial configuration
    setDiameterDisabled(false);
    setLengthDisabled(true);
    setTubingDisabled(true);
    setMeshDisabled(true);
    setLiquidDisabled(true);
    setLoadDisabled(true);
    setFillingDisabled(true);
    setButtonDisabled(true);
    
    // Clear form data and MLFB
    setFormData([]);
    setMLFBArray([]);
    
    // Clear parent MLFB array
    if (props.setMLFBArray) {
      props.setMLFBArray([]);
    }
    
    // Clear parent part number options
    if (props.setPartNumberOptions) {
      props.setPartNumberOptions([]);
    }
    
    // Close dialog
    setShowConfirmDialog(false);
  };

  const handleDisables = (option) => {
    console.log("🔧 handleDisables called with option:", option);
    console.log("🏷️ Option name:", option.optionName);
    // Handle sequential enabling for both normal workflow and API pre-populated workflow
    switch (option.optionName) {
      case "Diameter":
        setDiameterDisabled(true);
        setLengthDisabled(false);
        break;
      case "Length":
        setLengthDisabled(true);
        setTubingDisabled(false);
        break;
      case "Tubing":
        setTubingDisabled(true);
        // If we have API options, skip to enabling the generate button
        if (props.partNumberOptions.length >= 4) {
          setButtonDisabled(false);
        } else {
          // Always enable mesh selection for manual configuration
          setMeshDisabled(false);
        }
        break;
      case "Mesh":
        // Always enable the next step for manual configuration
        setMeshDisabled(true);
        setFillingDisabled(false);
        break;
      case "Filling":
        // Always enable the next step for manual configuration
        setFillingDisabled(true);
        setLiquidDisabled(false);
        break;
      case "Liquid":
        // Always enable the next step for manual configuration
        setLiquidDisabled(true);
        setLoadDisabled(false);
        break;
      case "Load":
        // Always enable generate button after load selection
        setLoadDisabled(true);
        setButtonDisabled(false);
        break;
      default:
        console.log("⚠️ Unknown option name:", option.optionName);
        console.log("📋 Full option object:", option);
        return null;
    }
  };

  const handleConfiguration = (option) => {
    console.log("🔧 Configuration selected:", option);
    setFormData((oldArray) => [...oldArray, option]);

    const changes = filters.filter(
      (f) =>
        f.selectedOption === option.code &&
        f.groupNumber === option.groupCode &&
        f.filterType === "E"
    );

    console.log("🔍 Filter changes found:", changes);

    // Create a new array instead of modifying the original
    const updatedOptions = [...options];
    changes.forEach((f) => {
      const index = updatedOptions.findIndex((o) => {
        return f.filterGroupNumber === o.groupCode && o.code === f.filterOption;
      });

      if (index > -1) {
        console.log("❌ Removing option:", updatedOptions[index]);
        updatedOptions.splice(index, 1);
      }
    });
    
    console.log("📊 Remaining filling options (group 12):", 
      updatedOptions.filter(o => o.groupCode === "12"));
    
    // Update the options state with the filtered array
    setOptions(updatedOptions);
  };

  if (isLoading || originalOptions.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading configuration options...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-2">
          
          {/* Configuration Steps */}
          <div className="space-y-2">
            
            {/* Diameter Selection */}
            <div className="space-y-1">
              <Label htmlFor="diameter" className="text-xs font-medium text-muted-foreground">
                1. Diameter
              </Label>
              <Select 
                value={selectedDiameter} 
                onValueChange={(value) => {
                  setSelectedDiameter(value);
                  changeHandler(value);
                }}
                disabled={diameterDisabled}
              >
                <SelectTrigger 
                  className={cn(
                    "w-full h-8 text-xs",
                    diameterDisabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <SelectValue placeholder="Select diameter..." />
                </SelectTrigger>
                <SelectContent>
                  {props.partNumberOptions.length === 7 ? (
                    <SelectItem value={props.partNumberOptions[0]?.id?.toString()}>
                      {props.partNumberOptions[0]?.code} - {props.partNumberOptions[0]?.name}
                    </SelectItem>
                  ) : (
                    options
                      .filter((option) => option.groupCode === "8")
                      .map((option) => (
                        <SelectItem key={option.code} value={option.id.toString()}>
                          {option.code} - {option.name}
                        </SelectItem>
                      ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Length Selection */}
            <div className="space-y-1">
              <Label htmlFor="length" className="text-xs font-medium text-muted-foreground">
                2. Length
              </Label>
              <Select 
                value={selectedLength} 
                onValueChange={(value) => {
                  setSelectedLength(value);
                  changeHandler(value);
                }}
                disabled={lengthDisabled}
              >
                <SelectTrigger 
                  className={cn(
                    "w-full h-8 text-xs",
                    lengthDisabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <SelectValue placeholder="Select length..." />
                </SelectTrigger>
                <SelectContent>
                  {props.partNumberOptions.length === 7 ? (
                    <SelectItem value={props.partNumberOptions[1]?.id?.toString()}>
                      {props.partNumberOptions[1]?.code} - {props.partNumberOptions[1]?.name}
                    </SelectItem>
                  ) : (
                    options
                      .filter((option) => option.groupCode === "9")
                      .map((option) => (
                        <SelectItem key={option.code} value={option.id.toString()}>
                          {option.code} - {option.name}
                        </SelectItem>
                      ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Tubing Material Selection */}
            <div className="space-y-1">
              <Label htmlFor="tubing" className="text-xs font-medium text-muted-foreground">
                3. Tubing Material
              </Label>
              <Select 
                value={selectedTubing} 
                onValueChange={(value) => {
                  setSelectedTubing(value);
                  changeHandler(value);
                }}
                disabled={tubingDisabled}
              >
                <SelectTrigger 
                  className={cn(
                    "w-full h-8 text-xs",
                    tubingDisabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <SelectValue placeholder="Select tubing material..." />
                </SelectTrigger>
                <SelectContent>
                  {props.partNumberOptions.length === 7 ? (
                    <SelectItem value={props.partNumberOptions[2]?.id?.toString()}>
                      {props.partNumberOptions[2]?.code} - {props.partNumberOptions[2]?.name}
                    </SelectItem>
                  ) : (
                    options
                      .filter((option) => option.groupCode === "10")
                      .map((option) => (
                        <SelectItem key={option.code} value={option.id.toString()}>
                          {option.code} - {option.name}
                        </SelectItem>
                      ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Mesh Size Selection */}
            <div className="space-y-1">
              <Label htmlFor="mesh" className="text-xs font-medium text-muted-foreground">
                4. Mesh Size
              </Label>
              <Select 
                value={selectedMesh} 
                onValueChange={(value) => {
                  setSelectedMesh(value);
                  changeHandler(value);
                }}
                disabled={meshDisabled}
              >
                <SelectTrigger 
                  className={cn(
                    "w-full h-8 text-xs",
                    meshDisabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <SelectValue placeholder="Select mesh size..." />
                </SelectTrigger>
                <SelectContent>
                  {props.partNumberOptions.length >= 4 ? (
                    // Show the pre-selected option plus all available options
                    <>
                      <SelectItem 
                        value={props.partNumberOptions[props.partNumberOptions.length === 7 ? 3 : 0]?.id?.toString()}
                        className="font-semibold bg-muted/50"
                      >
                        {props.partNumberOptions[props.partNumberOptions.length === 7 ? 3 : 0]?.code} - {props.partNumberOptions[props.partNumberOptions.length === 7 ? 3 : 0]?.name} (Current)
                      </SelectItem>
                      <div className="border-t my-1" />
                      {originalOptions
                        .filter((option) => option.groupCode === "11")
                        .map((option) => (
                          <SelectItem key={option.code} value={option.id.toString()}>
                            {option.code} - {option.name}
                          </SelectItem>
                        ))}
                    </>
                  ) : (
                    originalOptions
                      .filter((option) => option.groupCode === "11")
                      .map((option) => (
                        <SelectItem key={option.code} value={option.id.toString()}>
                          {option.code} - {option.name}
                        </SelectItem>
                      ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Filling Material Selection */}
            <div className="space-y-1">
              <Label htmlFor="filling" className="text-xs font-medium text-muted-foreground">
                5. Filling Material
              </Label>
              <Select 
                value={selectedFilling} 
                onValueChange={(value) => {
                  setSelectedFilling(value);
                  changeHandler(value);
                }}
                disabled={fillingDisabled}
              >
                <SelectTrigger 
                  className={cn(
                    "w-full h-8 text-xs",
                    fillingDisabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <SelectValue placeholder="Select filling material..." />
                </SelectTrigger>
                <SelectContent>
                  {props.partNumberOptions.length >= 4 ? (
                    // Show the pre-selected option plus all available options
                    <>
                      <SelectItem 
                        value={props.partNumberOptions[props.partNumberOptions.length === 7 ? 4 : 1]?.id?.toString()}
                        className="font-semibold bg-muted/50"
                      >
                        {props.partNumberOptions[props.partNumberOptions.length === 7 ? 4 : 1]?.code} - {props.partNumberOptions[props.partNumberOptions.length === 7 ? 4 : 1]?.name} (Current)
                      </SelectItem>
                      <div className="border-t my-1" />
                      {originalOptions
                        .filter((option) => option.groupCode === "12" || option.groupCode === "A")
                        .map((option) => (
                          <SelectItem key={option.code} value={option.id.toString()}>
                            {option.code} - {option.name}
                          </SelectItem>
                        ))}
                    </>
                  ) : (
                    originalOptions
                      .filter((option) => option.groupCode === "12" || option.groupCode === "A")
                      .map((option) => (
                        <SelectItem key={option.code} value={option.id.toString()}>
                          {option.code} - {option.name}
                        </SelectItem>
                      ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Liquid Phase Selection */}
            <div className="space-y-1">
              <Label htmlFor="liquid" className="text-xs font-medium text-muted-foreground">
                6. Liquid Phase
              </Label>
              <Select 
                value={selectedLiquid} 
                onValueChange={(value) => {
                  setSelectedLiquid(value);
                  changeHandler(value);
                }}
                disabled={liquidDisabled}
              >
                <SelectTrigger 
                  className={cn(
                    "w-full h-8 text-xs",
                    liquidDisabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <SelectValue placeholder="Select liquid phase..." />
                </SelectTrigger>
                <SelectContent>
                  {props.partNumberOptions.length >= 4 ? (
                    // Show the pre-selected option plus all available options
                    <>
                      <SelectItem 
                        value={props.partNumberOptions[props.partNumberOptions.length === 7 ? 5 : 2]?.id?.toString()}
                        className="font-semibold bg-muted/50"
                      >
                        {props.partNumberOptions[props.partNumberOptions.length === 7 ? 5 : 2]?.code} - {props.partNumberOptions[props.partNumberOptions.length === 7 ? 5 : 2]?.name} (Current)
                      </SelectItem>
                      <div className="border-t my-1" />
                      {originalOptions
                        .filter((option) => option.groupCode === "13" || option.groupCode === "B")
                        .map((option) => (
                          <SelectItem key={option.code} value={option.id.toString()}>
                            {option.code} - {option.name}
                          </SelectItem>
                        ))}
                    </>
                  ) : (
                    originalOptions
                      .filter((option) => option.groupCode === "13" || option.groupCode === "B")
                      .map((option) => (
                        <SelectItem key={option.code} value={option.id.toString()}>
                          {option.code} - {option.name}
                        </SelectItem>
                      ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Load Selection */}
            <div className="space-y-1">
              <Label htmlFor="load" className="text-xs font-medium text-muted-foreground">
                7. Load
              </Label>
              <Select 
                value={selectedLoad} 
                onValueChange={(value) => {
                  setSelectedLoad(value);
                  changeHandler(value);
                }}
                disabled={loadDisabled}
              >
                <SelectTrigger 
                  className={cn(
                    "w-full h-8 text-xs",
                    loadDisabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <SelectValue placeholder="Select load..." />
                </SelectTrigger>
                <SelectContent>
                  {props.partNumberOptions.length >= 4 ? (
                    // Show the pre-selected option plus all available options
                    <>
                      <SelectItem 
                        value={props.partNumberOptions[props.partNumberOptions.length === 7 ? 6 : 3]?.id?.toString()}
                        className="font-semibold bg-muted/50"
                      >
                        {props.partNumberOptions[props.partNumberOptions.length === 7 ? 6 : 3]?.code} - {props.partNumberOptions[props.partNumberOptions.length === 7 ? 6 : 3]?.name} (Current)
                      </SelectItem>
                      <div className="border-t my-1" />
                      {originalOptions
                        .filter((option) => option.groupCode === "14" || option.groupCode === "C")
                        .map((option) => (
                          <SelectItem key={option.code} value={option.id.toString()}>
                            {option.code} - {option.name}
                          </SelectItem>
                        ))}
                    </>
                  ) : (
                    originalOptions
                      .filter((option) => option.groupCode === "14" || option.groupCode === "C")
                      .map((option) => (
                        <SelectItem key={option.code} value={option.id.toString()}>
                          {option.code} - {option.name}
                        </SelectItem>
                      ))
                  )}
                </SelectContent>
              </Select>
            </div>
            
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-1 pt-2 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleRestart}
              className="flex items-center justify-center space-x-1 w-full text-xs h-7"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Reset</span>
            </Button>

            <Button
              type="submit"
              disabled={buttonDisabled}
              className="flex items-center justify-center space-x-1 w-full text-xs h-7"
            >
              <Zap className="h-3 w-3" />
              <span>Generate</span>
            </Button>
          </div>
        </form>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Configuration</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reset the entire configuration? This will clear all your selections and you'll need to start over.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRestart}>
              Reset Configuration
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default Filterbox;