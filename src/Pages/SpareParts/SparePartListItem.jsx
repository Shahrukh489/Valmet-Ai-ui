import { Plus, Package } from "lucide-react";
import { toast } from "react-toastify";
import { useStateValue } from "../../Redux/stateProvider";
import { Link } from "react-router-dom";

import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { addItem, removeItem, updateQuantity, clearCart } from "../../Redux/cartSlice";

import "../../components/ListItem/customScroll.css";


function SparePartListItem(props) {
  
  // const img = cld
  //   .image(`${props.partNumber}`)
  //   .format("auto") // Optimize delivery by resizing and applying auto-format and auto-quality
  //   .quality("auto")
  //   .resize(auto().gravity(autoGravity()).width(500).height(500)); // Transform the image: auto-crop to square aspect_ratio

  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);

  const handleAddtoBasket = () => {
    addToBasket();
    toast.success(`Added ${props.name} to Cart`, { position: "bottom-right" });
  };

  let USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
   
  const img = props.partnumber

  const addToBasket = () => {
    // Dispatch an action to add an item to the cart
    dispatch(
      addItem({
        id: props.id,
        name: props.name,
        partNumber: props.partNumber,
        quantity: 1,
      })
    );

    // dispatch({
    //   type: "Add_to_Basket",
    //   item: {
    //     name: props.name,
    //     partNumber: props.partNumber
    //   },
  };

  return (
    <Container>
      <Row>
        <ListGroup as="ol">
          <Col>
            <br />
            <ListGroup.Item
              className="d-flex align-items-center"
              style={{ borderRadius: "3px", padding: "40px" }}
            >
              <Col md={2} style={{ marginTop: "10px" }}>
                <img
                  src={"2021784-001.jpg"}
                  alt=""
                  style={{
                    maxWidth: "150px",
                    alignContent: "start",
                  }}
                />
              </Col>

              <Col
                md={7}
                className="p-3"
                style={{ textAlign: "left", overflow: "auto" }}
              >
                <div>
                  <h6>{props.name}</h6>
                  <p style={{ fontSize: "12px" }}>
                    Part Number: {props.partNumber}
                  </p>

                  {/* {props.kit === "Yes" ? (
                    <p style={{ fontSize: "12px" }}>
                      isKit:{" "}
                      <Link
                        to={`/itemdetails/${props.name}/${props.partNumber}`}
                        style={{ color: "blue" }}
                      >
                        See Items In Kit
                      </Link>
                    </p>
                  ) : (
                    <p style={{ fontSize: "12px" }}>isKit: {props.kit}</p>
                  )} */}

                  <p
                    style={{
                      maxHeight: "150px",
                      overflow: "auto",
                      fontSize: "12px",
                      textAlign: "left",
                      marginLeft: "0px",
                    }}
                    className=" pt-0"
                  >
                    Description: {props.name}
                  </p>
                </div>
              </Col>

              <Col
                xs={12}
                md={1}
                style={{ fontSize: "12px" }}
                className="p-1 mt-3"
              >
                <Link to={"/details"}>See Details</Link>
                <p>{USDollar.format(props.price)}</p>
              </Col>

              <Col
                style={{
                  height: "40px",
                  justifyContent: "flex-end",
                }}
                xs={12}
                md={2}
              >
                <Button
                  variant="outline-success"
                  style={{
                    fontSize: "12px",
                    marginLeft: "40px",
                    fontFamily: "sans-serif",
                  }}
                  onClick={handleAddtoBasket}
                >
                  Add to Invoice
                </Button>
              </Col>
            </ListGroup.Item>
          </Col>
        </ListGroup>

        {/* // <ListItemPart part_number={item.part_references} index={key}/> */}
      </Row>
    </Container>
  );
}

export default SparePartListItem;
