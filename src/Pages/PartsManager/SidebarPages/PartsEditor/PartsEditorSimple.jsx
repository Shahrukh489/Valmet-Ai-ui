import React, { useState, useEffect, useCallback } from 'react';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Search, 
  RefreshCw,
  AlertCircle,
  Settings,
  Columns,
  RotateCcw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../../components/ui/dialog";
import { Badge } from "../../../../components/ui/badge";
import { LoadingSpinner } from "../../../../components/ui/loading-spinner";
import { Switch } from "../../../../components/ui/switch";

// Field configuration for dynamic form generation
const FIELD_CONFIGS = {
  // Core fields (always visible)
  core: [
    { key: 'partnumber', label: 'Part Number', type: 'text', required: true, readonly: true },
    { key: 'description', label: 'Description', type: 'textarea', required: true },
    { key: 'price', label: 'Price', type: 'number', step: '0.01', prefix: '$' },
    { key: 'mlfb', label: 'MLFB Code', type: 'text' }
  ],
  // Category fields
  category: [
    { key: 'itemCategory', label: 'Item Category', type: 'select', options: [] },
    { key: 'productCategory', label: 'Product Category', type: 'select', options: [] },
    { key: 'subProductCategory', label: 'Sub Product Category', type: 'select', options: [] }
  ],
  // Additional fields
  additional: [
    { key: 'refP', label: 'Reference Part', type: 'text' },
    { key: 'costs', label: 'Costs', type: 'number', step: '0.01' },
    { key: 'ved', label: 'VED Classification', type: 'select', options: ['V', 'E', 'D'] },
    { key: 'atonStatus', label: 'ATON Status', type: 'text' },
    { key: 'maxum', label: 'Maximum Quantity', type: 'number' },
    { key: 'note', label: 'Public Note', type: 'textarea' },
    { key: 'internalNote', label: 'Internal Note', type: 'textarea' },
    { key: 'salesText', label: 'Sales Text', type: 'textarea' },
    { key: 'minWh', label: 'Min Warehouse Qty', type: 'number' },
    { key: 'pricePmd', label: 'PMD Price', type: 'number', step: '0.01' },
    { key: 'gcCategory', label: 'GC Category', type: 'text' }
  ]
};

function PartsEditorSimple() {
  
  // API Configuration
  const SPAREPARTSAPI_BASE_URL = "https://wea-spt-use-dv-sparepartsapi-001.azurewebsites.net";

  // State management
  const [parts, setParts] = useState([]);
  const [filteredParts, setFilteredParts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState({
    item: [],
    product: [],
    subProduct: []
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  // Search and filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: 'partnumber', direction: 'asc' });

  // UI State
  const [selectedParts, setSelectedParts] = useState(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFieldManager, setShowFieldManager] = useState(false);
  const [showColumnManager, setShowColumnManager] = useState(false);
  
  // Form state
  const [editingPart, setEditingPart] = useState(null);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [customFields, setCustomFields] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState(new Set(['partnumber', 'description', 'price', 'itemCategory']));

  // Field management
  const [newFieldConfig, setNewFieldConfig] = useState({
    key: '',
    label: '',
    type: 'text',
    required: false,
    options: []
  });

  // Fetch all categories on mount
  useEffect(() => {
    fetchCategories();
    fetchParts();
  }, [currentPage, pageSize]);

  // Filter parts when search term or filters change
  useEffect(() => {
    filterParts();
  }, [searchTerm, activeFilters, parts]);

  const fetchCategories = async () => {
    try {
      const [itemCats, productCats, subProductCats] = await Promise.all([
        fetch(`${SPAREPARTSAPI_BASE_URL}/v1/spareparts/api/spareparts/GetAllItemCategories`).then(r => r.json()),
        fetch(`${SPAREPARTSAPI_BASE_URL}/v1/spareparts/api/spareparts/GetAllProductCategories`).then(r => r.json()),
        fetch(`${SPAREPARTSAPI_BASE_URL}/v1/spareparts/api/spareparts/GetAllSubProductCategories`).then(r => r.json())
      ]);

      setCategories({
        item: itemCats.result || [],
        product: productCats.result || [],
        subProduct: subProductCats.result || []
      });

      // Update field configs with category options
      FIELD_CONFIGS.category[0].options = itemCats.result || [];
      FIELD_CONFIGS.category[1].options = productCats.result || [];
      FIELD_CONFIGS.category[2].options = subProductCats.result || [];
      
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchParts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${SPAREPARTSAPI_BASE_URL}/v1/spareparts/api/spareparts/GetSpareParts?pageNumber=${currentPage}&pageSize=${pageSize}`
      );
      const data = await response.json();
      
      setParts(data.result?.data || []);
      setTotalPages(data.result?.totalPages || 1);
      setTotalItems(data.result?.totalItems || 0);
    } catch (error) {
      console.error('Error fetching parts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterParts = useCallback(() => {
    let filtered = [...parts];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(part =>
        part.partnumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.mlfb?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply active filters
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter(part => part[key] === value);
      }
    });

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key] || '';
        const bVal = b[sortConfig.key] || '';
        
        if (sortConfig.direction === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    }

    setFilteredParts(filtered);
  }, [parts, searchTerm, activeFilters, sortConfig]);

  const getAllFieldConfigs = () => {
    return [
      ...FIELD_CONFIGS.core,
      ...FIELD_CONFIGS.category,
      ...FIELD_CONFIGS.additional,
      ...customFields
    ];
  };

  const validateForm = (data) => {
    const errors = {};
    const allFields = getAllFieldConfigs();

    allFields.forEach(field => {
      if (field.required && !data[field.key]) {
        errors[field.key] = `${field.label} is required`;
      }
      
      if (field.type === 'number' && data[field.key] && isNaN(data[field.key])) {
        errors[field.key] = `${field.label} must be a valid number`;
      }
    });

    return errors;
  };

  const handleCreatePart = () => {
    setEditingPart(null);
    setFormData({});
    setFormErrors({});
    setShowCreateModal(true);
  };

  const handleEditPart = (part) => {
    setEditingPart(part);
    setFormData({ ...part });
    setFormErrors({});
    setShowEditModal(true);
  };

  const handleDeletePart = (part) => {
    setEditingPart(part);
    setShowDeleteModal(true);
  };

  const handleSavePart = async () => {
    const errors = validateForm(formData);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setSaving(true);
    try {
      // TODO: Implement actual API calls for create/update
      if (editingPart) {
        // Update existing part
        console.log('Updating part:', formData);
        // await updatePart(editingPart.partnumber, formData);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update local state
        setParts(parts.map(p => p.partnumber === editingPart.partnumber ? formData : p));
      } else {
        // Create new part
        console.log('Creating part:', formData);
        // await createPart(formData);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Add to local state
        setParts([formData, ...parts]);
      }

      setShowCreateModal(false);
      setShowEditModal(false);
    } catch (error) {
      console.error('Error saving part:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setSaving(true);
    try {
      // TODO: Implement actual API call for delete
      console.log('Deleting part:', editingPart.partnumber);
      // await deletePart(editingPart.partnumber);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove from local state
      setParts(parts.filter(p => p.partnumber !== editingPart.partnumber));
      setSelectedParts(prev => {
        const newSet = new Set(prev);
        newSet.delete(editingPart.partnumber);
        return newSet;
      });

      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting part:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedParts.size === 0) return;

    setSaving(true);
    try {
      // TODO: Implement bulk delete API call
      console.log('Bulk deleting parts:', Array.from(selectedParts));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove from local state
      setParts(parts.filter(p => !selectedParts.has(p.partnumber)));
      setSelectedParts(new Set());
    } catch (error) {
      console.error('Error bulk deleting parts:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddCustomField = () => {
    if (!newFieldConfig.key || !newFieldConfig.label) return;

    const newField = { ...newFieldConfig };
    setCustomFields([...customFields, newField]);
    setNewFieldConfig({
      key: '',
      label: '',
      type: 'text',
      required: false,
      options: []
    });
  };

  const handleRemoveCustomField = (fieldKey) => {
    setCustomFields(customFields.filter(f => f.key !== fieldKey));
    // Also remove the field data from all parts
    setParts(parts.map(part => {
      const newPart = { ...part };
      delete newPart[fieldKey];
      return newPart;
    }));
  };

  const toggleSelectAll = () => {
    if (selectedParts.size === filteredParts.length) {
      setSelectedParts(new Set());
    } else {
      setSelectedParts(new Set(filteredParts.map(p => p.partnumber)));
    }
  };

  const toggleSelectPart = (partnumber) => {
    const newSet = new Set(selectedParts);
    if (newSet.has(partnumber)) {
      newSet.delete(partnumber);
    } else {
      newSet.add(partnumber);
    }
    setSelectedParts(newSet);
  };

  const renderFormField = (field, value, onChange) => {
    const error = formErrors[field.key];
    const fieldId = `field-${field.key}`;

    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={fieldId} className="flex items-center gap-1">
              {field.label}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            <textarea
              id={fieldId}
              value={value || ''}
              onChange={(e) => onChange(field.key, e.target.value)}
              disabled={field.readonly}
              className={`w-full min-h-[80px] px-3 py-2 border rounded-md bg-background text-foreground ${
                error ? 'border-destructive' : 'border-border'
              } ${field.readonly ? 'opacity-60' : ''}`}
              placeholder={`Enter ${field.label.toLowerCase()}`}
            />
            {error && <span className="text-sm text-destructive">{error}</span>}
          </div>
        );

      case 'select':
        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={fieldId} className="flex items-center gap-1">
              {field.label}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Select value={value || ''} onValueChange={(val) => onChange(field.key, val)}>
              <SelectTrigger className={error ? 'border-destructive' : ''}>
                <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <span className="text-sm text-destructive">{error}</span>}
          </div>
        );

      case 'number':
        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={fieldId} className="flex items-center gap-1">
              {field.label}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            <div className="relative">
              {field.prefix && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {field.prefix}
                </span>
              )}
              <Input
                id={fieldId}
                type="number"
                step={field.step}
                value={value || ''}
                onChange={(e) => onChange(field.key, e.target.value)}
                disabled={field.readonly}
                className={`${field.prefix ? 'pl-8' : ''} ${error ? 'border-destructive' : ''}`}
                placeholder={`Enter ${field.label.toLowerCase()}`}
              />
            </div>
            {error && <span className="text-sm text-destructive">{error}</span>}
          </div>
        );

      default:
        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={fieldId} className="flex items-center gap-1">
              {field.label}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={fieldId}
              type="text"
              value={value || ''}
              onChange={(e) => onChange(field.key, e.target.value)}
              disabled={field.readonly}
              className={error ? 'border-destructive' : ''}
              placeholder={`Enter ${field.label.toLowerCase()}`}
            />
            {error && <span className="text-sm text-destructive">{error}</span>}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background py-6">
      <div className="container mx-auto px-6 max-w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Parts Editor</h1>
              <p className="text-sm text-muted-foreground">
                Manage spare parts with advanced editing capabilities
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button onClick={() => setShowFieldManager(true)} variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Manage Fields
            </Button>
            <Button onClick={() => setShowColumnManager(true)} variant="outline">
              <Columns className="h-4 w-4 mr-2" />
              Columns
            </Button>
            <Button onClick={handleCreatePart}>
              <Plus className="h-4 w-4 mr-2" />
              Add Part
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search parts by number, description, or MLFB..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={pageSize.toString()} onValueChange={(val) => setPageSize(parseInt(val))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="20">20 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                  <SelectItem value="100">100 per page</SelectItem>
                </SelectContent>
              </Select>

              {selectedParts.size > 0 && (
                <Button 
                  variant="destructive" 
                  onClick={handleBulkDelete}
                  disabled={saving}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected ({selectedParts.size})
                </Button>
              )}

              <Button onClick={fetchParts} variant="outline" disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {(Object.keys(activeFilters).length > 0 || searchTerm) && (
              <div className="flex flex-wrap gap-2 mt-4">
                {searchTerm && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Search: {searchTerm}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchTerm('')} />
                  </Badge>
                )}
                {Object.entries(activeFilters).map(([key, value]) => (
                  <Badge key={key} variant="secondary" className="flex items-center gap-1">
                    {key}: {value}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => setActiveFilters(prev => ({ ...prev, [key]: '' }))} 
                    />
                  </Badge>
                ))}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => { setActiveFilters({}); setSearchTerm(''); }}
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Clear All
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <span>Parts Database</span>
                <Badge variant="outline">{totalItems} total</Badge>
              </CardTitle>
              
              <div className="text-sm text-muted-foreground">
                Showing {filteredParts.length} of {totalItems} parts
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : filteredParts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No parts found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || Object.keys(activeFilters).length > 0 
                    ? 'Try adjusting your search or filters'
                    : 'Start by adding your first spare part'
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-2">
                        <input
                          type="checkbox"
                          checked={selectedParts.size === filteredParts.length && filteredParts.length > 0}
                          onChange={toggleSelectAll}
                          className="rounded border-gray-300"
                        />
                      </th>
                      {Array.from(visibleColumns).map(columnKey => {
                        const field = getAllFieldConfigs().find(f => f.key === columnKey);
                        return (
                          <th key={columnKey} className="text-left p-2 font-medium">
                            <button 
                              className="flex items-center gap-1"
                              onClick={() => setSortConfig({
                                key: columnKey,
                                direction: sortConfig.key === columnKey && sortConfig.direction === 'asc' ? 'desc' : 'asc'
                              })}
                            >
                              {field?.label || columnKey}
                              {sortConfig.key === columnKey && (
                                <span className="text-xs">
                                  {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                </span>
                              )}
                            </button>
                          </th>
                        );
                      })}
                      <th className="text-left p-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredParts.map((part) => (
                      <tr key={part.partnumber} className="border-b border-border/50">
                        <td className="p-2">
                          <input
                            type="checkbox"
                            checked={selectedParts.has(part.partnumber)}
                            onChange={() => toggleSelectPart(part.partnumber)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        {Array.from(visibleColumns).map(columnKey => (
                          <td key={columnKey} className="p-2 max-w-48 truncate">
                            {columnKey === 'price' && part[columnKey] ? 
                              `$${parseFloat(part[columnKey]).toFixed(2)}` : 
                              part[columnKey] || '-'
                            }
                          </td>
                        ))}
                        <td className="p-2">
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditPart(part)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeletePart(part)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create/Edit Modal */}
        <Dialog open={showCreateModal || showEditModal} onOpenChange={() => {
          setShowCreateModal(false);
          setShowEditModal(false);
        }}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {editingPart ? 'Edit Part' : 'Create New Part'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              {getAllFieldConfigs().map(field => 
                renderFormField(field, formData[field.key], (key, value) => 
                  setFormData(prev => ({ ...prev, [key]: value }))
                )
              )}
            </div>

            <DialogFooter className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSavePart} disabled={saving}>
                {saving ? <LoadingSpinner size="sm" className="mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                {editingPart ? 'Update Part' : 'Create Part'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Delete Part
              </DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <p className="text-muted-foreground">
                Are you sure you want to delete part <strong>{editingPart?.partnumber}</strong>? 
                This action cannot be undone.
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteConfirm} disabled={saving}>
                {saving ? <LoadingSpinner size="sm" className="mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
                Delete Part
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Field Manager Modal */}
        <Dialog open={showFieldManager} onOpenChange={setShowFieldManager}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Manage Custom Fields
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Add New Field */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Add New Field</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Field Key</Label>
                      <Input
                        value={newFieldConfig.key}
                        onChange={(e) => setNewFieldConfig(prev => ({ ...prev, key: e.target.value }))}
                        placeholder="fieldKey"
                      />
                    </div>
                    <div>
                      <Label>Field Label</Label>
                      <Input
                        value={newFieldConfig.label}
                        onChange={(e) => setNewFieldConfig(prev => ({ ...prev, label: e.target.value }))}
                        placeholder="Field Label"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Field Type</Label>
                      <Select 
                        value={newFieldConfig.type} 
                        onValueChange={(val) => setNewFieldConfig(prev => ({ ...prev, type: val }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="textarea">Textarea</SelectItem>
                          <SelectItem value="select">Select</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="required"
                        checked={newFieldConfig.required}
                        onChange={(e) => setNewFieldConfig(prev => ({ ...prev, required: e.target.checked }))}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="required">Required</Label>
                    </div>
                  </div>

                  {newFieldConfig.type === 'select' && (
                    <div>
                      <Label>Options (comma-separated)</Label>
                      <Input
                        placeholder="Option 1, Option 2, Option 3"
                        onChange={(e) => setNewFieldConfig(prev => ({ 
                          ...prev, 
                          options: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                        }))}
                      />
                    </div>
                  )}

                  <Button onClick={handleAddCustomField} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Field
                  </Button>
                </CardContent>
              </Card>

              {/* Existing Custom Fields */}
              {customFields.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Custom Fields</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {customFields.map((field) => (
                        <div key={field.key} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <span className="font-medium">{field.label}</span>
                            <span className="text-sm text-muted-foreground ml-2">({field.type})</span>
                            {field.required && <Badge variant="secondary" className="ml-2">Required</Badge>}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveCustomField(field.key)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <DialogFooter>
              <Button onClick={() => setShowFieldManager(false)}>
                Done
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Column Manager Modal */}
        <Dialog open={showColumnManager} onOpenChange={setShowColumnManager}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Columns className="h-5 w-5" />
                Manage Visible Columns
              </DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <div className="space-y-2">
                {getAllFieldConfigs().map((field) => (
                  <div key={field.key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`col-${field.key}`}
                      checked={visibleColumns.has(field.key)}
                      onChange={(e) => {
                        const newSet = new Set(visibleColumns);
                        if (e.target.checked) {
                          newSet.add(field.key);
                        } else {
                          newSet.delete(field.key);
                        }
                        setVisibleColumns(newSet);
                      }}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor={`col-${field.key}`}>{field.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button onClick={() => setShowColumnManager(false)}>
                Done
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default PartsEditorSimple;