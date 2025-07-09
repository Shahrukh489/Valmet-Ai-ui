import { Plus, Package } from "lucide-react";
import { showToast } from "../../lib/toast-utils";
import { useDispatch, useSelector } from "react-redux";
import { addItem, removeItem, updateQuantity, clearCart } from "../../Redux/cartSlice";

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import ListItemPart from "./ListItemPart";
import './customScroll.css'

function ListItem(props) {

   let USDollar = new Intl.NumberFormat("en-US", {
     style: "currency",
     currency: "USD",
   });

  const dispatch = useDispatch();
  const handleAddtoBasket = () => {
    addToBasket();
    showToast.cart(props.mlfb);
  };
  
  const addToBasket = () => {
    dispatch(
      addItem({
        id: props.mlfb,
        name: props.mlfb,
        partNumber: props.partNumber,
        price: props.price,
        quantity: 1,
      })
    );
  };

  return (
    <div className="w-full mb-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start space-x-4">
            
            {/* Icon placeholder for image */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">
                    MLFB: {props.mlfb}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Part Number: {props.partNumber}
                  </p>
                  
                  {/* Configuration details */}
                  <div className="max-h-24 overflow-auto">
                    <div className="flex flex-wrap gap-1">
                      {props.configuration?.map((option, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {option.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Price and Action */}
                <div className="flex flex-col items-end space-y-2 ml-4">
                  <div className="text-lg font-semibold text-primary">
                    {USDollar.format(props.price)}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleAddtoBasket}
                    className="flex items-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add to Invoice</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



export default ListItem;
