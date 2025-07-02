import React, { useState, useEffect } from "react";
import { 
  Loader2, 
  RotateCcw, 
  Filter, 
  Search, 
  Tag, 
  Package, 
  Layers, 
  Boxes, 
  ChevronDown 
} from "lucide-react";

import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "../../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { cn } from "../../lib/utils";

function PartsFilter({ setFormData, getSearchValue, onSubmitFilter }) {
  const [itemCategories, setItemCategories] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [subProductCategories, setSubProductCategories] = useState([]);

  const [formDataLocal, setFormDataLocal] = useState({});
  const [gcTerm, setGcTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openField, setOpenField] = useState(null);

  const SPAREPARTSAPI_BASE_URL =
    "https://wea-spt-use-dv-sparepartsapi-001.azurewebsites.net";

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [itemRes, productRes, subProductRes] = await Promise.all([
          fetch(
            `${SPAREPARTSAPI_BASE_URL}/v1/spareparts/api/spareparts/GetAllItemCategories`
          ),
          fetch(
            `${SPAREPARTSAPI_BASE_URL}/v1/spareparts/api/spareparts/GetAllProductCategories`
          ),
          fetch(
            `${SPAREPARTSAPI_BASE_URL}/v1/spareparts/api/spareparts/GetAllSubProductCategories`
          ),
        ]);

        const [itemData, productData, subProductData] = await Promise.all([
          itemRes.json(),
          productRes.json(),
          subProductRes.json(),
        ]);

        setItemCategories(itemData.result || []);
        setProductCategories(productData.result || []);
        setSubProductCategories(subProductData.result || []);
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };

    fetchFilterOptions();
  }, []);

  const handleInputChange = (value, field) => {
    const updatedData = { ...formDataLocal, [field]: value };
    setFormDataLocal(updatedData);
    setFormData(updatedData);
  };

  const handleGCInput = (e) => {
    const term = e.target.value;
    setGcTerm(term);
    getSearchValue?.(term);
    handleInputChange(term, "mlfb");
  };

  const handleSearchInput = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    getSearchValue?.(term);
    handleInputChange(term, "description");
  };

  const handleReset = () => {
    const clearedData = {
      itemCategory: "",
      productCategory: "",
      subProductCategory: "",
      mlfb: "",
      description: "",
    };

    setFormDataLocal(clearedData);
    setFormData(clearedData);
    setGcTerm("");
    setSearchTerm("");
  };

  const getFieldIcon = (field) => {
    switch (field) {
      case 'itemCategory':
        return <Boxes className="w-3 h-3 text-cyan-500" />;
      case 'productCategory':
        return <Layers className="w-3 h-3 text-purple-500" />;
      case 'subProductCategory':
        return <Tag className="w-3 h-3 text-indigo-500" />;
      default:
        return <Filter className="w-3 h-3 text-gray-400" />;
    }
  };

  const Combobox = ({ options, value, field, label }) => (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
        {getFieldIcon(field)}
        {label}
      </Label>
      <Popover
        open={openField === field}
        onOpenChange={() => setOpenField(openField === field ? null : field)}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-full justify-between text-left h-9 px-3 text-sm bg-white dark:bg-gray-800",
              "border border-gray-200 dark:border-gray-600",
              "hover:bg-gray-50 dark:hover:bg-gray-700",
              "focus:ring-1 focus:ring-blue-500 focus:border-blue-500",
              "transition-colors duration-200",
              !value && "text-gray-500 dark:text-gray-400"
            )}
          >
            <span className="truncate">
              {value || `Select ${label.toLowerCase()}`}
            </span>
            <ChevronDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 shadow-lg border border-gray-200 dark:border-gray-600">
          <Command>
            <CommandInput 
              placeholder={`Search ${label.toLowerCase()}...`} 
              className="h-9 border-none focus:ring-0 px-3 text-sm" 
            />
            <CommandEmpty className="py-4 text-center text-xs text-gray-500">
              No {label.toLowerCase()} found.
            </CommandEmpty>
            <CommandList className="max-h-48">
              {options.map((opt, idx) => {
                const val = typeof opt === "object" ? opt.itemKey : opt;
                return (
                  <CommandItem
                    key={idx}
                    value={val}
                    className="cursor-pointer px-3 py-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                    onSelect={() => {
                      handleInputChange(val, field);
                      setOpenField(null);
                    }}
                  >
                    {val}
                  </CommandItem>
                );
              })}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );

  return (
    <Card className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
              <Filter className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Filter
            </CardTitle>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <RotateCcw className="h-3 w-3" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-4">
        <form
          id="filter-form"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmitFilter?.(formDataLocal, 1);
          }}
          className="space-y-4"
        >
          {/* GC Number Field */}
          <div className="space-y-1.5">
            <Label htmlFor="gc-search" className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
              <Package className="w-3 h-3 text-blue-500" />
              GC Number
            </Label>
            <Input
              id="gc-search"
              type="text"
              placeholder="e.g. P10..."
              value={gcTerm}
              onChange={handleGCInput}
              className="h-9 text-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Part Description Field */}
          <div className="space-y-1.5">
            <Label htmlFor="description-search" className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
              <Search className="w-3 h-3 text-emerald-500" />
              Part Description
            </Label>
            <Input
              id="description-search"
              type="text"
              placeholder="Search descriptions..."
              value={searchTerm}
              onChange={handleSearchInput}
              className="h-9 text-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Product Category Field */}
          <Combobox
            options={productCategories}
            value={formDataLocal.productCategory}
            field="productCategory"
            label="Product Category"
          />

          {/* Item Category Field */}
          <Combobox
            options={itemCategories}
            value={formDataLocal.itemCategory}
            field="itemCategory"
            label="Item Category"
          />

          {/* Sub Product Category Field */}
          <Combobox
            options={subProductCategories}
            value={formDataLocal.subProductCategory}
            field="subProductCategory"
            label="Sub Product Category"
          />

          {/* Search Button */}
          <div className="pt-2">
            <Button
              type="submit"
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default PartsFilter;
