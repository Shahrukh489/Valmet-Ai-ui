import React from "react";
import { ExternalLink, Package } from "lucide-react";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";

import { Link } from "react-router-dom";

function CardComp(props) {
  const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <Card className="text-center hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex justify-center mb-4">
          {props.image ? (
            <img
              src={props.image}
              alt={props.name}
              className="h-24 w-24 object-contain rounded-lg"
            />
          ) : (
            <div className="h-24 w-24 bg-muted rounded-lg flex items-center justify-center">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>
        <h3 className="font-semibold text-foreground text-lg">
          {props.name}
        </h3>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="text-2xl font-bold text-primary">
            {USDollar.format(props.price || 0)}
          </div>
          <Button variant="outline" size="sm" asChild className="w-full">
            <Link to={`/itemdetails/${props.id}`} className="flex items-center justify-center space-x-2">
              <ExternalLink className="h-4 w-4" />
              <span>See Details</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
export default CardComp;
