import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { Loader2, ShoppingCart, Package, DollarSign, Info, AlertCircle, ArrowLeft, Check, Heart, Share2, Truck, Shield, RotateCcw, Plus, Minus } from "lucide-react";

const ItemDetailsPage = () => {
  const { partNumber } = useParams();
  const [part, setPart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlist, setIsWishlist] = useState(false);

  //URLS
  const SPAREPARTSAPI_BASE_URL =
    "https://wea-spt-use-dv-sparepartsapi-001.azurewebsites.net";

  const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  useEffect(() => {
    const fetchPart = async () => {
      try {
        const response = await fetch(
          `${SPAREPARTSAPI_BASE_URL}/v1/spareparts/api/spareparts/GetSparePartByPartNumber?partNumber=${partNumber}`
        );
        const data = await response.json();
        if (!data.result) {
          throw new Error("No part found.");
        }
        setPart(data.result);
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPart();
  }, [partNumber]);

  const detailSections = [
    {
      title: "Basic Information",
      icon: <Package className="h-4 w-4" />,
      fields: [
        { label: "Part Number", key: "partnumber" },
        { label: "Description", key: "description" },
        { label: "MLFB", key: "mlfb" },
      ]
    },
    {
      title: "Pricing & Costs",
      icon: <DollarSign className="h-4 w-4" />,
      fields: [
        { label: "Price", key: "price", format: "currency" },
        { label: "Costs", key: "costs", format: "currency" },
      ]
    },
    {
      title: "Categories",
      icon: <Info className="h-4 w-4" />,
      fields: [
        { label: "Item Category", key: "itemCategory" },
        { label: "Product Category", key: "productCategory" },
        { label: "Sub Product Category", key: "subProductCategory" },
      ]
    },
    {
      title: "Status & Classification",
      icon: <AlertCircle className="h-4 w-4" />,
      fields: [
        { label: "VED Classification", key: "ved" },
        { label: "Aton Status", key: "atonStatus" },
        { label: "Maxum", key: "maxum" },
      ]
    },
    {
      title: "Additional Information",
      icon: <Info className="h-4 w-4" />,
      fields: [
        { label: "Note", key: "note" },
        { label: "Internal Note", key: "internalNote" },
      ]
    }
  ];

  const formatValue = (value, format) => {
    if (!value || value === "N/A") return "Not Available";
    if (format === "currency") return USDollar.format(value);
    return value;
  };

  const handleQuantityChange = (change) => {
    setQuantity(Math.max(1, quantity + change));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading part details...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <p className="text-destructive text-lg font-medium">{error}</p>
        </div>
      ) : (
        <>
          {/* Navigation Bar */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center py-3">
                <button 
                  onClick={() => window.history.back()} 
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to search results
                </button>
              </div>
            </div>
          </div>

          {/* Main Product Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Product Image Section */}
              <div className="lg:col-span-5">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="aspect-square bg-white rounded-lg border border-gray-100 dark:border-gray-600 overflow-hidden">
                    <img
                      src={`https://stasptusedvapp.blob.core.windows.net/part-images/${part.partnumber}.JPG`}
                      alt={part.description}
                      className="w-full h-full object-contain p-4"
                      onError={(e) => {
                        e.target.src = '/No_Image_Available.jpg';
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Product Info Section */}
              <div className="lg:col-span-4">
                <div className="space-y-6">
                  {/* Product Title & Basic Info */}
                  <div>
                    <h1 className="text-2xl font-normal text-gray-900 dark:text-gray-100 mb-4">
                      {part.description}
                    </h1>
                    
                    {/* Part Number & Status */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-mono">Part #{part.partnumber}</span>
                      {part.ved && (
                        <Badge variant="outline" className="text-xs">
                          VED: {part.ved}
                        </Badge>
                      )}
                      <div className="flex items-center gap-1 text-green-600">
                        <Check className="h-4 w-4" />
                        <span>In Stock</span>
                      </div>
                    </div>
                  </div>

                  {/* Price Section */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Price:</span>
                      <span className="text-3xl text-red-600 font-normal">
                        {USDollar.format(part.price)}
                      </span>
                    </div>
                    {part.costs && part.costs !== part.price && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500 line-through">
                          {USDollar.format(part.costs)}
                        </span>
                        <span className="text-sm text-green-600 font-medium">
                          Save {USDollar.format(part.costs - part.price)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Key Features */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">About this item</h3>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Original Valmet spare part - {part.partnumber}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Category: {part.itemCategory || 'Industrial Parts'}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Product line: {part.productCategory || 'Valmet'}</span>
                      </li>
                      {part.mlfb && (
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>MLFB: {part.mlfb}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Purchase Section */}
              <div className="lg:col-span-3">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sticky top-4">
                  {/* Price Display */}
                  <div className="mb-4">
                    <div className="text-2xl font-normal text-red-600 mb-1">
                      {USDollar.format(part.price)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Unit price for invoicing
                    </div>
                  </div>

                  {/* Availability Info */}
                  <div className="mb-4 text-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <Truck className="h-4 w-4 text-green-600" />
                      <span className="text-green-600 font-medium">Available</span>
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      Ready for order processing
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Quantity:
                    </label>
                    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md w-24">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="flex-1 text-center py-2 border-x border-gray-300 dark:border-gray-600">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button className="w-full bg-orange-400 hover:bg-orange-500 text-white font-medium py-2 rounded-full">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Invoice
                    </Button>
                    
                    <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium py-2 rounded-full">
                      Request Quote
                    </Button>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1 border-gray-300 dark:border-gray-600"
                        onClick={() => setIsWishlist(!isWishlist)}
                      >
                        <Heart className={`h-4 w-4 mr-2 ${isWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                        {isWishlist ? 'Saved' : 'Save'}
                      </Button>
                      <Button variant="outline" className="border-gray-300 dark:border-gray-600">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Business Features */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-green-600" />
                        <span>Secure business transaction</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <RotateCcw className="h-4 w-4 text-blue-600" />
                        <span>Standard warranty terms</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details Tabs */}
            <div className="mt-8">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <div className="px-6 py-4">
                    <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100">Product Details</h2>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    
                    {/* Basic Information */}
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <Package className="h-4 w-4 text-blue-600" />
                        Basic Information
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Part Number</dt>
                          <dd className="text-sm text-gray-900 dark:text-gray-100 font-mono">{part.partnumber || "Not Available"}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</dt>
                          <dd className="text-sm text-gray-900 dark:text-gray-100">{part.description || "Not Available"}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">MLFB</dt>
                          <dd className="text-sm text-gray-900 dark:text-gray-100 font-mono">{part.mlfb || "Not Available"}</dd>
                        </div>
                      </div>
                    </div>

                    {/* Pricing & Categories */}
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        Pricing & Categories
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Price</dt>
                          <dd className="text-sm text-gray-900 dark:text-gray-100 font-medium">{formatValue(part.price, "currency")}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Costs</dt>
                          <dd className="text-sm text-gray-900 dark:text-gray-100">{formatValue(part.costs, "currency")}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Item Category</dt>
                          <dd className="text-sm text-gray-900 dark:text-gray-100">{part.itemCategory || "Not Available"}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Product Category</dt>
                          <dd className="text-sm text-gray-900 dark:text-gray-100">{part.productCategory || "Not Available"}</dd>
                        </div>
                      </div>
                    </div>

                    {/* Status & Classification */}
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                        Status & Classification
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">VED Classification</dt>
                          <dd className="text-sm text-gray-900 dark:text-gray-100">
                            {part.ved ? (
                              <Badge variant="outline" className="text-xs">
                                {part.ved === 'V' ? 'Vital' : part.ved === 'E' ? 'Essential' : 'Desirable'} ({part.ved})
                              </Badge>
                            ) : (
                              "Not Available"
                            )}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Aton Status</dt>
                          <dd className="text-sm text-gray-900 dark:text-gray-100">{part.atonStatus || "Not Available"}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Maxum</dt>
                          <dd className="text-sm text-gray-900 dark:text-gray-100">{part.maxum || "Not Available"}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Sub Product Category</dt>
                          <dd className="text-sm text-gray-900 dark:text-gray-100">{part.subProductCategory || "Not Available"}</dd>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  {(part.note || part.internalNote) && (part.note !== "Not Available" || part.internalNote !== "Not Available") && (
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <Info className="h-4 w-4 text-blue-600" />
                        Additional Information
                      </h3>
                      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                        <div className="space-y-3">
                          {part.note && part.note !== "Not Available" && (
                            <div>
                              <dt className="text-sm font-medium text-amber-700 dark:text-amber-300">Note</dt>
                              <dd className="text-sm text-amber-800 dark:text-amber-200 mt-1">{part.note}</dd>
                            </div>
                          )}
                          {part.internalNote && part.internalNote !== "Not Available" && (
                            <div>
                              <dt className="text-sm font-medium text-amber-700 dark:text-amber-300">Internal Note</dt>
                              <dd className="text-sm text-amber-700 dark:text-amber-300 mt-1">{part.internalNote}</dd>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ItemDetailsPage;
