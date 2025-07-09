import React from 'react'
import { Plus, Package } from "lucide-react";
import { showToast } from "../../lib/toast-utils";
import { useStateValue } from "../../Redux/stateProvider";

import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

import './customScroll.css'

function KitListItem(props) {
  // console.log(props.mlfb)
  // console.log(props.configuration)
  const [{ basket }, dispatch] = useStateValue();
  const handleAddtoBasket = () => {
    addToBasket();
    showToast.cart(props.mlfb || "Item");
  };
  const addToBasket = () => {
    //dispatch item to the data layer
    dispatch({
      type: "Add_to_Basket",
      item: {
        name: props.mlfb,
        partNumber: props.partNumber
      },
    });

    console.log(basket);
  };
  return (
    <Container fluid>
      <Row>
        <ListGroup as="ol" >
          <Col xs= {10}>
            <br />
            <ListGroup.Item
              className="d-flex align-items-center"
              style={{ borderRadius: '3px', padding: '50px' }}
            >
              <Col md={2}>
                <img
                  src="https://m.media-amazon.com/images/I/711MUuOhJiL._AC_SL1500_.jpg"
                  alt=""
                  style={{
                    maxWidth: "100px",
                    alignContent: 'center'
                  }}
                />
              </Col>

              <Col md={7} className="p-3" style={{ textAlign: "left" }}>

                <div>
                  <h6>{props.name}</h6>
                  <p style={{ fontSize: '12px'}}>Part Number:  {props.partNumber}</p>

                  <p style={{ maxHeight: '150px', overflow: 'auto', fontSize: '12px', textAlign: 'left', marginLeft: '0px' }} className=" pt-0">
                  {/* {props.configuration.map((option) => {   
                            
                                return (
                                  <div style={{display: 'inline'}}>{option.name}, &nbsp; </div>      
                                )
                            })} */}
                  </p>
                </div>

              </Col>

              {/* <Col xs={12} md={1} style={{ fontSize: '12px' }} className="p-1 mt-3">
                <p>Price: $1000</p>
              </Col> */}

              <Col
                style={{
                  height: "40px",
                  justifyContent: "flex-end",
                }}
                xs={12}
                md={2}
              >
              
                  <Button variant="outline-success" style={{ fontSize: '12px', marginLeft: '40px', fontFamily: 'sans-serif'}} onClick={handleAddtoBasket}>
                    Add to Invoice
                  </Button>
               
              </Col>
            </ListGroup.Item>
          </Col>
        </ListGroup>

        {/* // <ListItemPart part_number={item.part_references} index={key}/> */}


      </Row>
    </Container>)
}

export default KitListItem