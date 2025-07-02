import React, { useState, useEffect, useCallback } from "react";
import { 
  Search, 
  MapPin, 
  Tag, 
  Activity, 
  Download, 
  Filter as FilterIcon,
  RotateCcw,
  FileSpreadsheet
} from 'lucide-react';
import { EmptySpareParts } from "./ExcelTemplates/EmptySpareParts";
import { LoadingSpinner } from "../../components/ui/loading-spinner";
import { useTranslation } from "react-i18next";

function Filters({ onFilteredParts }) {
  const { t } = useTranslation('global');
  // Form state
  const [filters, setFilters] = useState({
    partNumber: "",
    location: "",
    category: "",
    status: ""
  });
  
  // Data state
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  // API Configuration
  const SPAREPARTSAPI_BASE_URL = import.meta.env.VITE_SPAREPARTSAPI_BASE_URL || 
    "https://wea-spt-use-dv-sparepartsapi-001.azurewebsites.net";

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${SPAREPARTSAPI_BASE_URL}/v1/spareparts/api/spareparts/GetAllCategories`
        );
        
        if (!response.ok) throw new Error('Failed to fetch categories');
        
        const data = await response.json();
        setCategories(data.result || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        // TODO: Add error toast notification
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, [SPAREPARTSAPI_BASE_URL]);

  // Handle input changes
  const handleFilterChange = useCallback((field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  }, []);

  // Apply filters
  const handleApplyFilters = async () => {
    setIsApplying(true);
    try {
      const queryParams = new URLSearchParams();
      
      // Only add non-empty filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key.charAt(0).toUpperCase() + key.slice(1), value);
        }
      });

      const url = `${SPAREPARTSAPI_BASE_URL}/v1/spareparts/api/spareparts/GetFilteredParts?${queryParams.toString()}`;
      const response = await fetch(url);

      if (!response.ok) throw new Error('Failed to fetch filtered parts');

      const data = await response.json();
      onFilteredParts(Array.isArray(data.result) ? data.result : []);
    } catch (error) {
      console.error("Error applying filters:", error);
      // TODO: Add error toast notification
    } finally {
      setIsApplying(false);
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      partNumber: "",
      location: "",
      category: "",
      status: ""
    });
    onFilteredParts([]);
  };

  // Download template
  const handleDownloadTemplate = () => {
    const url = `${SPAREPARTSAPI_BASE_URL}/v1/spareparts/generate-template`;
    const fileName = "SparePartsListTemplate.xlsx";
    EmptySpareParts(url, fileName);
  };

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(value => value !== "");

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Filter Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Part Number */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            {t('filters.partNumber')}
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('filters.partNumber')}
              value={filters.partNumber}
              onChange={(e) => handleFilterChange('partNumber', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            {t('filters.location')}
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="w-full pl-10 pr-8 py-2 border border-border rounded-lg text-sm bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary appearance-none"
            >
              <option value="">{t('filters.allLocations')}</option>
              <option value="Houston">Houston</option>
              <option value="Finland">Finland</option>
            </select>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            {t('filters.category')}
          </label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              disabled={isLoading}
              className="w-full pl-10 pr-8 py-2 border border-border rounded-lg text-sm bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary appearance-none disabled:bg-muted"
            >
              <option value="">{t('filters.allCategories')}</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            {t('filters.status')}
          </label>
          <div className="relative">
            <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full pl-10 pr-8 py-2 border border-border rounded-lg text-sm bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary appearance-none"
            >
              <option value="">{t('filters.allStatus')}</option>
              <option value="Active">{t('common.active')}</option>
              <option value="Inactive">{t('common.inactive')}</option>
              <option value="Discontinued">{t('filters.discontinued')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Apply Filters */}
        <button
          onClick={handleApplyFilters}
          disabled={isApplying}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50"
        >
          {isApplying ? (
            <LoadingSpinner size="sm" />
          ) : (
            <FilterIcon className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">
            {isApplying ? t('filters.applying') : t('filters.applyFilters')}
          </span>
        </button>

        {/* Reset Filters */}
        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg animate-fade-in"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-sm font-medium">{t('filters.resetFilters')}</span>
          </button>
        )}

        <div className="h-8 w-px bg-border" />

        {/* Export Data */}
        <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg">
          <Download className="w-4 h-4" />
          <span className="text-sm font-medium">{t('filters.exportData')}</span>
        </button>

        {/* Download Template */}
        <button
          onClick={handleDownloadTemplate}
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span className="text-sm font-medium">{t('filters.downloadTemplate')}</span>
        </button>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 animate-slide-up">
          <span className="text-sm text-muted-foreground">{t('filters.activeFilters')}</span>
          {Object.entries(filters).map(([key, value]) => {
            if (!value) return null;
            
            return (
              <span
                key={key}
                className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm animate-scale-in"
              >
                <span className="font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                </span>
                <span>{value}</span>
                <button
                  onClick={() => handleFilterChange(key, "")}
                  className="ml-1"
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Filters;