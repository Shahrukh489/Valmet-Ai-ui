import React from "react";
import "./subtotal.css";
import { useStateValue } from "../../../Redux/stateProvider";
import { getBasketTotal } from "../../../Redux/reducer";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
} from "../../../Redux/cartSlice";

function Subtotal() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);

  return (
    <div className="subtotal">
     
            {/* <p>
              Subtotal: {items.length}:
             
            </p> */}

      <button>Export To LN</button>
    </div>
  );
}

export default Subtotal;
