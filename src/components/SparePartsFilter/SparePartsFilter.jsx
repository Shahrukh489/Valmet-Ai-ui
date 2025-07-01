import React, { useState } from "react";
import { 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  X, 
  Search,
  Calendar,
  Package,
  DollarSign,
  Wrench,
  Zap,
  Truck,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import "./SparePartsFilter.css";

const SparePartsFilter = ({ onFiltersChange, className = "" }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    category: [],
    priceRange: { min: 0, max: 10000 },
    availability: [],
    manufacturer: [],
    partType: [],
    condition: []
  });

  const filterCategories = [
    {
      id: "category",
      title: "Category",
      icon: Package,
      type: "checkbox",
      options: [
        { value: "mechanical", label: "Mechanical Parts", icon: Wrench, count: 142 },
        { value: "electrical", label: "Electrical Components", icon: Zap, count: 89 },
        { value: "hydraulic", label: "Hydraulic Systems", icon: Truck, count: 67 },
        { value: "bearings", label: "Bearings & Seals", icon: Package, count: 203 },
        { value: "sensors", label: "Sensors & Controls", icon: AlertCircle, count: 156 }
      ]
    },
    {
      id: "availability",
      title: "Availability",
      icon: CheckCircle,
      type: "checkbox",
      options: [
        { value: "in-stock", label: "In Stock", count: 524 },
        { value: "limited", label: "Limited Stock", count: 89 },
        { value: "on-order", label: "On Order", count: 43 },
        { value: "discontinued", label: "Discontinued", count: 12 }
      ]
    },
    {
      id: "manufacturer",
      title: "Manufacturer",
      icon: Package,
      type: "checkbox",
      options: [
        { value: "valmet", label: "Valmet", count: 312 },
        { value: "abb", label: "ABB", count: 198 },
        { value: "siemens", label: "Siemens", count: 156 },
        { value: "schneider", label: "Schneider Electric", count: 134 },
        { value: "honeywell", label: "Honeywell", count: 89 }
      ]
    },
    {
      id: "condition",
      title: "Condition",
      icon: CheckCircle,
      type: "radio",
      options: [
        { value: "new", label: "New", count: 456 },
        { value: "refurbished", label: "Refurbished", count: 123 },
        { value: "used", label: "Used", count: 78 }
      ]
    }
  ];

  const handleFilterChange = (categoryId, value, checked) => {
    const newActiveFilters = { ...activeFilters };

    if (categoryId === "condition") {
      // Radio button behavior
      newActiveFilters[categoryId] = checked ? [value] : [];
    } else {
      // Checkbox behavior
      if (checked) {
        newActiveFilters[categoryId] = [...newActiveFilters[categoryId], value];
      } else {
        newActiveFilters[categoryId] = newActiveFilters[categoryId].filter(item => item !== value);
      }
    }

    setActiveFilters(newActiveFilters);
    onFiltersChange?.(newActiveFilters);
  };

  const handlePriceRangeChange = (type, value) => {
    const newPriceRange = { ...activeFilters.priceRange, [type]: parseInt(value) };
    const newActiveFilters = { ...activeFilters, priceRange: newPriceRange };
    setActiveFilters(newActiveFilters);
    onFiltersChange?.(newActiveFilters);
  };

  const clearAllFilters = () => {
    const resetFilters = {
      category: [],
      priceRange: { min: 0, max: 10000 },
      availability: [],
      manufacturer: [],
      partType: [],
      condition: []
    };
    setActiveFilters(resetFilters);
    onFiltersChange?.(resetFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    Object.keys(activeFilters).forEach(key => {
      if (key === "priceRange") {
        if (activeFilters.priceRange.min > 0 || activeFilters.priceRange.max < 10000) {
          count++;
        }
      } else if (Array.isArray(activeFilters[key]) && activeFilters[key].length > 0) {
        count += activeFilters[key].length;
      }
    });
    return count;
  };

  const FilterSection = ({ category }) => {
    const [isOpen, setIsOpen] = useState(true);
    const IconComponent = category.icon;

    return (
      <div className="border-b border-gray-100 last:border-b-0">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <IconComponent className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
            <span className="font-medium text-gray-900">{category.title}</span>
          </div>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>
        
        {isOpen && (
          <div className="px-4 pb-4 space-y-2">
            {category.options.map((option) => (
              <label
                key={option.value}
                className="flex items-center justify-between group cursor-pointer p-2 rounded-md hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <input
                    type={category.type}
                    name={category.id}
                    value={option.value}
                    checked={activeFilters[category.id].includes(option.value)}
                    onChange={(e) => handleFilterChange(category.id, option.value, e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <div className="flex items-center gap-2">
                    {option.icon && <option.icon className="w-4 h-4 text-gray-500" />}
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                      {option.label}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {option.count}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
          {getActiveFilterCount() > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {getActiveFilterCount()} active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {getActiveFilterCount() > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Clear all
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Active Filters Pills */}
      {getActiveFilterCount() > 0 && (
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-wrap gap-2">
            {Object.entries(activeFilters).map(([categoryId, values]) => {
              if (categoryId === "priceRange") {
                if (values.min > 0 || values.max < 10000) {
                  return (
                    <span
                      key="price"
                      className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full"
                    >
                      <DollarSign className="w-3 h-3" />
                      ${values.min} - ${values.max}
                      <button
                        onClick={() => handlePriceRangeChange("min", 0) || handlePriceRangeChange("max", 10000)}
                        className="hover:bg-blue-100 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                }
              } else if (Array.isArray(values) && values.length > 0) {
                return values.map((value) => {
                  const category = filterCategories.find(cat => cat.id === categoryId);
                  const option = category?.options.find(opt => opt.value === value);
                  return (
                    <span
                      key={`${categoryId}-${value}`}
                      className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full"
                    >
                      {option?.label || value}
                      <button
                        onClick={() => handleFilterChange(categoryId, value, false)}
                        className="hover:bg-blue-100 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                });
              }
              return null;
            })}
          </div>
        </div>
      )}

      {/* Filter Content */}
      {isExpanded && (
        <div className="divide-y divide-gray-100">
          {/* Price Range Filter */}
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Price Range</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Min</label>
                  <input
                    type="number"
                    value={activeFilters.priceRange.min}
                    onChange={(e) => handlePriceRangeChange("min", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Max</label>
                  <input
                    type="number"
                    value={activeFilters.priceRange.max}
                    onChange={(e) => handlePriceRangeChange("max", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="10000"
                  />
                </div>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="10000"
                  value={activeFilters.priceRange.max}
                  onChange={(e) => handlePriceRangeChange("max", e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          </div>

          {/* Dynamic Filter Sections */}
          {filterCategories.map((category) => (
            <FilterSection key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SparePartsFilter;