import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { Loader2, ShoppingCart, Package, DollarSign, Info, AlertCircle, ArrowLeft, Star, Check } from "lucide-react";

const ItemDetailsPage = () => {
  const { partNumber } = useParams();
  const [part, setPart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="min-h-screen bg-background">
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
          {/* Compact Header */}
          <div className="bg-gradient-to-r from-background via-muted/10 to-background border-b">
            <div className="max-w-6xl mx-auto px-6 py-4">
              <button 
                onClick={() => window.history.back()} 
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-3 text-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to results
              </button>
              
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-xl font-semibold text-foreground mb-2 line-clamp-2">
                    {part.description}
                  </h1>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="font-mono text-muted-foreground">
                      Part #{part.partnumber}
                    </span>
                    {part.ved && (
                      <Badge variant="secondary" className="text-xs px-2 py-1">
                        VED: {part.ved}
                      </Badge>
                    )}
                    <div className="flex items-center gap-1">
                      <Check className="h-3 w-3 text-success" />
                      <span className="text-success text-xs">In Stock</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right ml-6">
                  <div className="text-2xl font-bold text-foreground">
                    {USDollar.format(part.price)}
                  </div>
                  <div className="text-xs text-muted-foreground">Current Price</div>
                </div>
              </div>
            </div>
          </div>

          {/* Compact Main Content */}
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              
              {/* Product Image - Smaller */}
              <div className="lg:col-span-2">
                <div className="bg-card border rounded-lg p-4">
                  <div className="aspect-square bg-muted/20 rounded-lg overflow-hidden mb-4">
                    <img
                      src={`https://stasptusedvapp.blob.core.windows.net/part-images/${part.partnumber}.JPG`}
                      alt={part.description}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/No_Image_Available.jpg';
                      }}
                    />
                  </div>
                  
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Invoice
                  </Button>
                </div>
              </div>

              {/* Product Details - Compact with ALL Information */}
              <div className="lg:col-span-3 space-y-4">
                
                {/* Basic Information */}
                <div className="bg-card border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-foreground text-sm">Basic Information</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <div className="space-y-1">
                      <span className="text-muted-foreground text-xs">Part Number</span>
                      <div className="font-mono text-foreground">{part.partnumber || "Not Available"}</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-muted-foreground text-xs">Description</span>
                      <div className="text-foreground">{part.description || "Not Available"}</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-muted-foreground text-xs">MLFB</span>
                      <div className="font-mono text-foreground">{part.mlfb || "Not Available"}</div>
                    </div>
                  </div>
                </div>

                {/* Pricing & Costs */}
                <div className="bg-card border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-foreground text-sm">Pricing & Costs</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <div className="space-y-1">
                      <span className="text-muted-foreground text-xs">Price</span>
                      <div className="text-foreground font-medium">{formatValue(part.price, "currency")}</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-muted-foreground text-xs">Costs</span>
                      <div className="text-foreground">{formatValue(part.costs, "currency")}</div>
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div className="bg-card border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-foreground text-sm">Categories</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <div className="space-y-1">
                      <span className="text-muted-foreground text-xs">Item Category</span>
                      <div className="text-foreground">{part.itemCategory || "Not Available"}</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-muted-foreground text-xs">Product Category</span>
                      <div className="text-foreground">{part.productCategory || "Not Available"}</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-muted-foreground text-xs">Sub Product Category</span>
                      <div className="text-foreground">{part.subProductCategory || "Not Available"}</div>
                    </div>
                  </div>
                </div>

                {/* Status & Classification */}
                <div className="bg-card border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-foreground text-sm">Status & Classification</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <div className="space-y-1">
                      <span className="text-muted-foreground text-xs">VED Classification</span>
                      <div className="text-foreground">
                        {part.ved ? (
                          <Badge variant="outline" className="text-xs px-2 py-0.5">
                            {part.ved === 'V' ? 'Vital' : part.ved === 'E' ? 'Essential' : 'Desirable'} ({part.ved})
                          </Badge>
                        ) : (
                          "Not Available"
                        )}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-muted-foreground text-xs">Aton Status</span>
                      <div className="text-foreground">{part.atonStatus || "Not Available"}</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-muted-foreground text-xs">Maxum</span>
                      <div className="text-foreground">{part.maxum || "Not Available"}</div>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="bg-card border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-foreground text-sm">Additional Information</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="space-y-1">
                      <span className="text-muted-foreground text-xs">Note</span>
                      <div className="text-foreground">{part.note || "Not Available"}</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-muted-foreground text-xs">Internal Note</span>
                      <div className="text-foreground">{part.internalNote || "Not Available"}</div>
                    </div>
                  </div>
                </div>

                {/* Important Notes - Highlighted if present */}
                {(part.note || part.internalNote) && (part.note !== "Not Available" || part.internalNote !== "Not Available") && (
                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      <h3 className="font-semibold text-amber-800 dark:text-amber-200 text-sm">
                        Important Notes
                      </h3>
                    </div>
                    {part.note && part.note !== "Not Available" && (
                      <div className="mb-2">
                        <span className="text-xs font-medium text-amber-700 dark:text-amber-300">Note:</span>
                        <p className="text-amber-800 dark:text-amber-200 text-sm">
                          {part.note}
                        </p>
                      </div>
                    )}
                    {part.internalNote && part.internalNote !== "Not Available" && (
                      <div>
                        <span className="text-xs font-medium text-amber-700 dark:text-amber-300">Internal Note:</span>
                        <p className="text-amber-700 dark:text-amber-300 text-sm">
                          {part.internalNote}
                        </p>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ItemDetailsPage;
