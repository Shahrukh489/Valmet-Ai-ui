import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { addItem } from "../../Redux/cartSlice";
import { 
  Package, 
  DollarSign, 
  Tag, 
  ExternalLink, 
  ShoppingCart,
  Layers,
  Boxes,
  ImageOff,
  CheckCircle,
  Info
} from "lucide-react";

function ListView(props) {
  const dispatch = useDispatch();
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  
  const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const handleAddtoBasket = () => {
    dispatch(
      addItem({
        id: props.id,
        name: props.name,
        partNumber: props.partNumber,
        price: props.price,
        quantity: 1,
      })
    );
    toast.success(`Added ${props.name} to Cart`, { position: "bottom-right" });
  };

  const getAvailabilityBadge = () => {
    return (
      <div className="flex items-center gap-1">
        <CheckCircle className="w-3 h-3 text-emerald-500" />
        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-medium">
          In Stock
        </Badge>
      </div>
    );
  };


  return (
    <Card className="group mb-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row">
          
          {/* Image Section */}
          <div className="relative lg:w-32 xl:w-36 lg:flex-shrink-0">
            <div className="aspect-square relative overflow-hidden bg-gray-50 dark:bg-gray-700">
              {!imageError ? (
                <>
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80">
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                  )}
                  <img
                    src={`https://stasptusedvapp.blob.core.windows.net/part-images/${props.partNumber}.JPG`}
                    alt={props.name}
                    className="w-full h-full object-cover"
                    onLoad={() => setImageLoading(false)}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      setImageError(true);
                      setImageLoading(false);
                    }}
                  />
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-600">
                  <ImageOff className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500 text-center px-2">
                    No Image
                  </span>
                </div>
              )}
              
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-4">
            <div className="h-full flex flex-col">
              
              {/* Header Section */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 mb-4">
                <div className="flex-1 min-w-0">
                  {/* Part Number Badge */}
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-3 h-3 text-blue-600" />
                    <Badge variant="outline" className="font-mono text-xs">
                      {props.partNumber}
                    </Badge>
                  </div>
                  
                  {/* Part Name */}
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 leading-tight mb-2">
                    {props.name}
                  </h3>
                  
                  {/* MLFB Code */}
                  <div className="flex items-center gap-2">
                    <Tag className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">MLFB:</span>
                    <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs font-mono text-gray-700 dark:text-gray-300">
                      {props.mlfb}
                    </code>
                  </div>
                </div>
                
                {/* Price Section */}
                <div className="flex flex-col items-end gap-2">
                  <div className="text-right">
                    <div className="flex items-baseline gap-1">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {USDollar.format(props.price).replace('$', '')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">USD per unit</p>
                  </div>
                  {getAvailabilityBadge()}
                </div>
              </div>

              {/* Details Grid */}
              <div className="flex-1 mb-4">
                
                {/* Note Section */}
                {props.note && (
                  <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Info className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-blue-900 dark:text-blue-100 mb-1">Note</p>
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                          {props.note}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="p-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded">
                    <div className="flex items-center gap-1 mb-1">
                      <Layers className="w-3 h-3 text-purple-500" />
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Product</span>
                    </div>
                    <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                      {props.productCategory || 'N/A'}
                    </p>
                  </div>
                  
                  <div className="p-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded">
                    <div className="flex items-center gap-1 mb-1">
                      <Boxes className="w-3 h-3 text-cyan-500" />
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Item</span>
                    </div>
                    <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                      {props.itemCategory || 'N/A'}
                    </p>
                  </div>
                  
                  <div className="p-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded">
                    <div className="flex items-center gap-1 mb-1">
                      <Tag className="w-3 h-3 text-indigo-500" />
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Sub-Category</span>
                    </div>
                    <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                      {props.subProductCategory || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-gray-200 dark:border-gray-600">
                <Link
                  to={`/details/${props.partNumber}`}
                  className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-150"
                >
                  <ExternalLink className="w-3 h-3" />
                  View Details
                </Link>
                
                <Button
                  onClick={handleAddtoBasket}
                  size="sm"
                  className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-150"
                >
                  <ShoppingCart className="w-3 h-3" />
                  Add to Invoice
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ListView;