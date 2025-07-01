import React from 'react'
import {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
} from "../../../Redux/cartSlice";
import { Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import CheckIcon from "@mui/icons-material/Check";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";


function TableRow(props) {

    const dispatch = useDispatch();
    
    const inputRef = useRef(null);
   
    const [itemQuantity, setItemQuantity] = useState(1);
    const [editItemId, setEditItemId] = useState(null);

    let USDollar = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });

     const removeFromBasket = (cartItem) => {
       //Remove from the basket
       dispatch(removeItem(cartItem));
     };

    const handleEdit = (itemId) => {
       setEditItemId(itemId);
     };

    const handleQtyEditConfirmation = (itemId) => {
       dispatch(
         updateQuantity({
           id: itemId,
           quantity: itemQuantity,
         })
       );

       setItemQuantity(0);
       setEditItemId(null);
     };

    const handleQuantityChange = (e) => {   
     const value = parseInt(e.target.value);
     setItemQuantity(value)
  }

  const handleKeyPress = (event) => {
     if (event.key === "Enter") {
       inputRef.current.nextSibling.click();
     }
    }
  return (
    <tr>
      <td key={props.item.id}>{props.item.name}</td>
      <td key={props.item.id}>{props.item.partNumber}</td>
      <td key={props.item.id} style={{ maxWidth: "75px" }}>
        {editItemId === props.item.id ? (
          <Row className="justify-content-center">
            <Col>
              <InputGroup>
                <Form.Control
                  onChange={handleQuantityChange}
                  onKeyDown={handleKeyPress}
                  ref={inputRef}
                  autoFocus
                />
                <Button
                  type="submit"
                  variant="success"
                  onClick={() => handleQtyEditConfirmation(props.item.id)}
                >
                  <CheckIcon />
                </Button>
              </InputGroup>
            </Col>
          </Row>
        ) : (
          <Button variant="warning" onClick={() => handleEdit(props.item.id)}>
            <div style={{ fontSize: "11px" }}>
              {props.item.quantity}
              <CreateOutlinedIcon />
            </div>
          </Button>
        )}
      </td>
      <td key={props.item.id}>
        <Button
          variant="danger"
          size="sm"
          className="remove-button"
          style={{ alignItems: "center" }}
          onClick={() => removeFromBasket(props.item)}
        >
          <DeleteOutlineOutlinedIcon />
        </Button>
      </td>
      <td key={props.item.id} style={{ fontWeight: "bold" }}>
        {USDollar.format(props.item.price * props.item.quantity)}
      </td>
    </tr>
  );
}

export default TableRow