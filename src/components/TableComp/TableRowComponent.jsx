import React from "react";
import { useState } from "react";

import { showToast } from "../../lib/toast-utils";
import { Link } from "react-router-dom";

import { useStateValue } from "../../Redux/stateProvider";


function TableRowComponent(props) {
  const [count, setCount] = useState(0);

  const [{ basket }, dispatch] = useStateValue();
  const qty = 0;

  const addQty = () => {
    setCount(count + 1);
  };

  const subtractQty = () => {
    if (count > 0) setCount(count - 1);
  };

  const addToBasket = () => {
    //dispatch item to the data layer
    dispatch({
      type: "Add_to_Basket",
      item: {
        name: props.item.item_name,
        image: props.item.image,
        price: props.item.price,
      },
    });
  };

  const handleAddtoBasket = () => {
    addToBasket();
    showToast.cart(props.item.item_name);
    console.log(basket);
  };
  return (
    <tr key={props.item.id}>
      
      <td style={{ fontFamily: "open sans", fontSize: "13px" }}>
        <Link to ={`/itemdetails/${props.item.id}`}>
        {props.item.item_name}
        </Link>
      </td>
      <td>${props.item.price}</td>
      
       
    </tr>
  );
}

export default TableRowComponent;
