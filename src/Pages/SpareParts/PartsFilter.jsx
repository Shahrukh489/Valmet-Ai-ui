import React, { useState, useEffect } from "react";
import { Loader2, RotateCcw, Filter } from "lucide-react";

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

  const Combobox = ({ options, value, field }) => (
    <Popover
      open={openField === field}
      onOpenChange={() => setOpenField(field)}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          size="sm"
          className="justify-between w-full mb-2 text-left border border-gray-300"
        >
          {value || `Select ${field}`}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search..." className="h-9" />
          <CommandEmpty>No match found.</CommandEmpty>
          <CommandList>
            {options.map((opt, idx) => {
              const val = typeof opt === "object" ? opt.itemKey : opt;
              return (
                <CommandItem
                  key={idx}
                  value={val}
                  className="text-left"
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
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Spare Parts Filter</CardTitle>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="flex items-center space-x-1"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <form
          id="filter-form"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmitFilter?.(formDataLocal, 1);
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="gc-search" className="text-sm font-medium">
              Search GC#
            </Label>
            <Input
              id="gc-search"
              type="text"
              placeholder="e.g. P10..."
              value={gcTerm}
              onChange={handleGCInput}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Item Category</Label>
            <Combobox
              options={itemCategories}
              value={formDataLocal.itemCategory}
              field="itemCategory"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Product Category</Label>
            <Combobox
              options={productCategories}
              value={formDataLocal.productCategory}
              field="productCategory"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Sub Product Category</Label>
            <Combobox
              options={subProductCategories}
              value={formDataLocal.subProductCategory}
              field="subProductCategory"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description-search" className="text-sm font-medium">
              Part Description
            </Label>
            <Input
              id="description-search"
              type="text"
              placeholder="Search descriptions..."
              value={searchTerm}
              onChange={handleSearchInput}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              "Search Spare Parts"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default PartsFilter;
