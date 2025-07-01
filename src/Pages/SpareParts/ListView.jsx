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
  AlertCircle,
  Layers,
  Boxes,
  ImageOff
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
    return <Badge className="bg-success text-success-foreground">In Stock</Badge>;
  };

  return (
    <Card className="group mb-4 border border-border hover:border-primary/20 hover:shadow-lg transition-all duration-300 overflow-hidden bg-card">
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row">
          
          {/* Image Section */}
          <div className="w-full lg:w-36 xl:w-40 lg:flex-shrink-0">
            <div className="aspect-square relative overflow-hidden rounded-lg bg-muted/20 border border-border shadow-sm">
              {!imageError ? (
                <>
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted/30 backdrop-blur-sm">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  <img
                    src={`https://stasptusedvapp.blob.core.windows.net/part-images/${props.partNumber}.JPG`}
                    alt={props.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onLoad={() => setImageLoading(false)}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      setImageError(true);
                      setImageLoading(false);
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-muted/40 to-muted/70 text-muted-foreground border-2 border-dashed border-muted-foreground/20">
                  <ImageOff className="w-10 h-10 mb-2 text-muted-foreground/60" />
                  <span className="text-xs font-medium text-center px-2 text-muted-foreground/80">No Image Available</span>
                </div>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6">
            <div className="flex flex-col h-full space-y-4">
              
              {/* Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3 mb-2">
                    <Package className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-semibold text-foreground leading-tight mb-1 break-words">
                        {props.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Tag className="w-3 h-3" />
                        <span className="font-mono">{props.partNumber}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-success" />
                    <span className="text-xl font-bold text-foreground">
                      {USDollar.format(props.price)}
                    </span>
                  </div>
                  {getAvailabilityBadge()}
                </div>
              </div>

              {/* Details Section */}
              <div className="flex-1 space-y-3">
                
                {/* MLFB Information */}
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-muted-foreground">MLFB:</span>
                  <span className="font-mono text-foreground bg-muted px-2 py-1 rounded text-xs">
                    {props.mlfb}
                  </span>
                </div>

                {/* Note Section */}
                {props.note && (
                  <div className="flex items-start gap-2 p-3 bg-info/10 border border-info/20 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-info mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-info italic">
                      {props.note}
                    </p>
                  </div>
                )}

                {/* Categories Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Layers className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <span className="text-muted-foreground">Product:</span>
                      <span className="ml-1 text-foreground font-medium">
                        {props.productCategory}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Boxes className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <span className="text-muted-foreground">Item:</span>
                      <span className="ml-1 text-foreground font-medium">
                        {props.itemCategory}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <span className="text-muted-foreground">Sub:</span>
                      <span className="ml-1 text-foreground font-medium">
                        {props.subProductCategory}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Section */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
                <Link
                  to={`/details/${props.partNumber}`}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary/20 hover:border-primary/30 transition-all duration-200 group"
                >
                  <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  View Details
                </Link>
                
                <Button
                  onClick={handleAddtoBasket}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-success text-success-foreground hover:bg-success/90 border-0 rounded-lg transition-all duration-200 group"
                >
                  <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform" />
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