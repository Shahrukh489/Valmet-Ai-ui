import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft, 
  CreditCard, 
  Package,
  DollarSign,
  Receipt,
  AlertCircle,
  CheckCircle
} from "lucide-react";

import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { cn } from "../../lib/utils";

import {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  getTotals
} from "../../Redux/cartSlice";

function ShoppingCartPage() {
  const items = useSelector((state) => state.cart.items);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTotals());
  }, [items, dispatch]);

  const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const handleUpdateQuantity = (item, newQuantity) => {
    if (newQuantity <= 0) {
      dispatch(removeItem(item));
    } else {
      dispatch(updateQuantity({ ...item, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (item) => {
    dispatch(removeItem(item));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-background via-muted/10 to-background border-b">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-primary/10 rounded-xl">
                  <ShoppingCart className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-foreground mb-2">
                    Shopping Cart
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Review and manage your selected spare parts
                  </p>
                  {items.length > 0 && (
                    <Badge variant="secondary" className="mt-2">
                      {cart.cartTotalQuantity} items • {USDollar.format(cart.cartTotalAmount)}
                    </Badge>
                  )}
                </div>
              </div>
              <Button variant="outline" size="lg" asChild className="flex-shrink-0">
                <Link to="/searchparts" className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Continue Shopping</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">

        {items.length === 0 ? (
          /* Empty Cart State */
          <Card>
            <CardContent className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                <ShoppingCart className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Your cart is empty
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Start adding spare parts to your cart to see them here. Browse our extensive catalog to find what you need.
              </p>
              <Button asChild>
                <Link to="/searchparts" className="flex items-center space-x-2">
                  <Package className="h-4 w-4" />
                  <span>Browse Parts</span>
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      Cart Items ({items.length})
                    </CardTitle>
                    {items.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearCart}
                        className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear All
                      </Button>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <div 
                        key={`${item.partNumber}-${index}`}
                        className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        {/* Item Image Placeholder */}
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package className="w-6 h-6 text-muted-foreground" />
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate">
                            {item.name || 'Spare Part'}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-1">
                            Part #{item.partNumber}
                          </p>
                          {item.mlfb && (
                            <p className="text-xs text-muted-foreground">
                              MLFB: {item.mlfb}
                            </p>
                          )}
                          <div className="text-lg font-semibold text-primary mt-2">
                            {USDollar.format(item.price || 0)}
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                            className="h-8 w-8 p-0 rounded-full"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                            className="h-8 w-8 p-0 rounded-full"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Item Total and Remove */}
                        <div className="text-right">
                          <div className="font-semibold text-foreground mb-2">
                            {USDollar.format((item.price || 0) * item.quantity)}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item)}
                            className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                
                {/* Summary Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      
                      {/* Summary Details */}
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Subtotal ({cart.cartTotalQuantity} items)
                          </span>
                          <span className="font-medium">
                            {USDollar.format(cart.cartTotalAmount)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Shipping</span>
                          <Badge variant="outline" className="text-success border-success">
                            Free
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Tax</span>
                          <span className="font-medium">$0.00</span>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex justify-between">
                          <span className="text-base font-semibold">Total</span>
                          <span className="text-xl font-bold text-primary">
                            {USDollar.format(cart.cartTotalAmount)}
                          </span>
                        </div>
                      </div>

                      {/* Checkout Button */}
                      <Button className="w-full" size="lg">
                        <CreditCard className="h-5 w-5 mr-2" />
                        Proceed to Checkout
                      </Button>

                      {/* Enterprise Info */}
                      <div className="bg-info/10 border border-info/20 rounded-lg p-3">
                        <div className="flex space-x-2">
                          <AlertCircle className="h-4 w-4 text-info flex-shrink-0 mt-0.5" />
                          <div className="text-sm">
                            <p className="font-medium text-info mb-1">
                              Enterprise Pricing
                            </p>
                            <p className="text-info/80 text-xs">
                              Contact sales for volume discounts and enterprise agreements.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Benefits */}
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                          <span>Free shipping on all orders</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                          <span>30-day return policy</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                          <span>Dedicated enterprise support</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Receipt className="h-4 w-4 mr-2" />
                        Save as Quote
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Request Pricing
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShoppingCartPage;