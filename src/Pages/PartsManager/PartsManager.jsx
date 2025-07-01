import React, { useState, useEffect, useMemo, useCallback } from "react";
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  AlertCircle
} from 'lucide-react';
import Filters from "./Filters";
import Pagination from "./Pagination";

function PartsManager() {
  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [partsData, setPartsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedRows, setSelectedRows] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // API Configuration
  const SPAREPARTSAPI_BASE_URL = import.meta.env.VITE_SPAREPARTSAPI_BASE_URL || 
    "https://wea-spt-use-dv-sparepartsapi-001.azurewebsites.net";
  const PAGE_SIZE = 15;

  // Fetch parts data
  const fetchParts = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${SPAREPARTSAPI_BASE_URL}/v1/spareparts/api/spareparts/GetSpareParts?pageNumber=${page}&pageSize=${PAGE_SIZE}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch parts');
      
      const data = await response.json();
      setPartsData(data.result.data || []);
      setTotalPages(data.result.totalPages || 1);
      setTotalItems(data.result.totalItems || 0);
      setFilteredData(data.result.data || []);
    } catch (error) {
      console.error("Error fetching spare parts:", error);
      // TODO: Add error toast notification
    } finally {
      setIsLoading(false);
    }
  }, [SPAREPARTSAPI_BASE_URL]);

  // Handle filtered parts from Filters component
  const handleFilteredParts = useCallback((data) => {
    setFilteredData(Array.isArray(data) ? data : []);
    setFiltersApplied(true);
    setCurrentPage(1);
  }, []);

  // Handle search
  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
    if (!value.trim()) {
      setFilteredData(partsData);
      return;
    }

    const searchLower = value.toLowerCase();
    const filtered = partsData.filter(part => 
      part.partnumber?.toLowerCase().includes(searchLower) ||
      part.description?.toLowerCase().includes(searchLower) ||
      part.mlfb?.toLowerCase().includes(searchLower)
    );
    setFilteredData(filtered);
  }, [partsData]);

  // Handle sorting
  const handleSort = useCallback((key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  }, [sortConfig]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key] || '';
      const bValue = b[sortConfig.key] || '';
      
      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });
  }, [filteredData, sortConfig]);

  // Handle row selection
  const handleSelectAll = useCallback((checked) => {
    if (checked) {
      setSelectedRows(sortedData.map(item => item.partnumber));
    } else {
      setSelectedRows([]);
    }
  }, [sortedData]);

  const handleSelectRow = useCallback((partnumber, checked) => {
    if (checked) {
      setSelectedRows(prev => [...prev, partnumber]);
    } else {
      setSelectedRows(prev => prev.filter(id => id !== partnumber));
    }
  }, []);

  // Effects
  useEffect(() => {
    if (!filtersApplied) {
      fetchParts(currentPage);
    }
  }, [currentPage, filtersApplied, fetchParts]);

  // Table columns configuration
  const columns = [
    { key: 'partnumber', label: 'Part No', sortable: true },
    { key: 'image', label: 'Image', sortable: false },
    { key: 'description', label: 'Description', sortable: true },
    { key: 'price', label: 'Price', sortable: true },
    { key: 'ved', label: 'VED', sortable: true },
    { key: 'atonStatus', label: 'Status', sortable: true },
    { key: 'maxum', label: 'Maxum', sortable: true },
    { key: 'mlfb', label: 'MLFB', sortable: true },
    { key: 'itemCategory', label: 'Category', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false }
  ];

  const formatPrice = (price) => {
    if (!price || price === "#N/A") return "N/A";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(price));
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-1 items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search parts by number, description, or MLFB..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                showFilters ? 'bg-blue-50 text-blue-600 border-blue-200' : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filters</span>
              {filtersApplied && (
                <span className="w-2 h-2 bg-blue-600 rounded-full" />
              )}
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchParts(currentPage)}
              disabled={isLoading}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Export</span>
            </button>

            {selectedRows.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg">
                <span className="text-sm font-medium">{selectedRows.length} selected</span>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Filters onFilteredParts={handleFilteredParts} />
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === sortedData.length && sortedData.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      column.sortable ? 'cursor-pointer hover:text-gray-700' : ''
                    }`}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center gap-1">
                      {column.label}
                      {column.sortable && sortConfig.key === column.key && (
                        <span className="text-blue-600">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-8 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                      <span className="text-gray-600">Loading parts...</span>
                    </div>
                  </td>
                </tr>
              ) : sortedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="w-8 h-8 text-gray-300" />
                      <span className="text-gray-500">No parts found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedData.map((item) => (
                  <tr key={item.partnumber} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(item.partnumber)}
                        onChange={(e) => handleSelectRow(item.partnumber, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {item.partnumber}
                    </td>
                    <td className="px-4 py-3">
                      <img
                        src={`https://stasptusedvapp.blob.core.windows.net/part-images/${item.partnumber}.JPG`}
                        alt={item.partnumber}
                        className="w-10 h-10 object-cover rounded"
                        onError={(e) => {
                          e.target.src = "/No_Image_Available.jpg";
                        }}
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                      {item.description}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {formatPrice(item.price)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.ved || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        item.atonStatus === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.atonStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.maxum || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.mlfb || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.itemCategory || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <Eye className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <Edit className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <Trash2 className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">
                Showing {((currentPage - 1) * PAGE_SIZE) + 1} to {Math.min(currentPage * PAGE_SIZE, totalItems)} of {totalItems} results
              </span>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PartsManager;