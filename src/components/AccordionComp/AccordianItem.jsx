import React, { useState } from "react";
import { Plus, Package } from "lucide-react";
import { useStateValue } from "../../Redux/stateProvider";
import { showToast } from "../../lib/toast-utils";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

function AccordianItem(props) {
    const [quantity, setQuantity] = useState(1);
    const [{ basket }, dispatch] = useStateValue();
    
    const handleAddtoBasket = () => {
        addToBasket();
        showToast.cart("Item");
    }
    
    const addToBasket = () => {
        //dispatch item to the data layer
        dispatch({
          type: "Add_to_Basket",
          item: {
            quantity: quantity
          },
        });
    
        console.log(basket);
    };

    const USDollar = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    });

    return (
        <div className="w-full">
            <div className="flex items-center space-x-4 p-4 border rounded-lg">
                {/* Product Image */}
                <div className="flex-shrink-0">
                    <img
                        src="https://m.media-amazon.com/images/I/614ZitKCwHL._AC_SL1500_.jpg"
                        alt="Product"
                        className="w-24 h-24 object-contain rounded-lg border"
                    />
                </div>

                {/* Product Description */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground">
                        Description: Lorem ipsum dolor sit amet
                    </p>
                </div>

                {/* Price */}
                <div className="flex-shrink-0">
                    <p className="text-lg font-semibold text-primary">
                        {USDollar.format(1000)}
                    </p>
                </div>

                {/* Quantity Input */}
                <div className="flex-shrink-0 w-24">
                    <Label htmlFor="quantity" className="text-xs">Qty</Label>
                    <Input
                        id="quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        min="1"
                        className="text-center"
                    />
                </div>

                {/* Add Button */}
                <div className="flex-shrink-0">
                    <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleAddtoBasket}
                        className="flex items-center space-x-1"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default AccordianItem;
