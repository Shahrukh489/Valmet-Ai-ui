import React from "react";
import { Trash2, Package } from "lucide-react";

import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { useStateValue } from "../../../Redux/stateProvider";

const CheckoutItem = (props) => {
  const [{ basket }, dispatch] = useStateValue();

  const removeFromBasket = () => {
    //Remove from the basket
    dispatch({
      type: "Remove_from_Basket",
      name: props.name,
    });
  };

  const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          {/* Product Image */}
          <div className="flex-shrink-0">
            {props.image ? (
              <img
                src={props.image}
                alt={props.name}
                className="w-24 h-24 object-contain rounded-lg border"
              />
            ) : (
              <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
                <Package className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground mb-2">{props.name}</h3>
            <p className="text-sm text-muted-foreground mb-1">
              Part Number: {props.partNumber}
            </p>
            <p className="text-sm text-muted-foreground mb-1">
              Quantity: 1
            </p>
            <p className="text-lg font-semibold text-primary">
              {USDollar.format(props.price || 0)}
            </p>
          </div>

          {/* Remove Button */}
          <div className="flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={removeFromBasket}
              className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground flex items-center space-x-1"
            >
              <Trash2 className="h-4 w-4" />
              <span>Remove</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckoutItem;
