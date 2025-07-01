import React, {useState} from 'react'
import PropTypes from "prop-types";
import { FaStar } from "react-icons/fa";

import { Card, CardContent } from "../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";


function FoundItem(props) {

    const [showModal, setShowModal] = useState(false);

    const handleEdit = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const handleSave = () => {
      // Handle save logic here
      console.log("Item edited");
      handleClose();
    };

    let USDollar = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });
   
  return (
    <>
      <Table
        responsive
        striped
        hover
        bordered
        style={{
          fontSize: "12px",
          textAlign: "center",
        }}
      >
        <thead style={{ fontSize: "13px" }}>
          <tr>
            <th>Part No</th>
            <th>Description</th>
            <th>Price</th>
            <th>Anton Staus</th>
            <th>Maxum</th>
            <th>MLFB</th>
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {/* {partsList.map((item, index) => (
          // <CheckoutItem
          //   key={item.id}
          //   name={item.name}
          //   partNumber={item.partNumber}
          //   image={item.image}
          //   description={item.description}
          //   price={item.price}
          // />
          <TableRow key={index} item={item} />
        ))} */}
          <tr>
            <td className="text-center align-middle">{props.partNumber}</td>
            <td className="text-center align-middle">{props.name}</td>
            <td className="text-center align-middle">
              {USDollar.format(props.price)}
            </td>
            <td className="text-center align-middle">{props.partNumber}</td>
            <td className="text-center align-middle">{props.partNumber}</td>
            <td
              className="text-center align-middle"
              style={{ textTransform: "uppercase" }}
            >
              {props.mlfb}
            </td>
            <td
              className="text-center align-middle"
              style={{ textTransform: "uppercase" }}
            >
              {props.category}
            </td>
            <td>
              <Button variant="warning" size="sm" onClick={handleEdit}>
                Edit Item
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formPartNumber" className="mb-2">
              <Form.Label className="small" style={{ fontWeight: "bold" }}>
                Part Number
              </Form.Label>
              <Form.Control type="text" defaultValue={props.partNumber} />
            </Form.Group>
            <Form.Group controlId="formName" className="mb-2">
              <Form.Label className="small" style={{ fontWeight: "bold" }}>
                Name
              </Form.Label>
              <Form.Control type="text" defaultValue={props.name} />
            </Form.Group>
            <Form.Group controlId="formPrice" className="mb-2">
              <Form.Label className="small" style={{ fontWeight: "bold" }}>
                Price
              </Form.Label>
              <Form.Control type="text" defaultValue={props.price} />
            </Form.Group>

            <Form.Group controlId="formImage" className="mb-2">
              <Form.Label className="small" style={{ fontWeight: "bold" }}>
                Upload Image
              </Form.Label>
              <Form.Control type="file" />
            </Form.Group>

            <Form.Group controlId="formMLFB" className="mb-2">
              <Form.Label className="small" style={{ fontWeight: "bold" }}>
                MLFB
              </Form.Label>
              <Form.Control type="text" defaultValue={props.mlfb} />
            </Form.Group>
            <Form.Group controlId="formCategory" className="mb-2">
              <Form.Label className="small" style={{ fontWeight: "bold" }}>
                Category
              </Form.Label>
              <Form.Control type="text" defaultValue={props.category} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
          <Button variant="success" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FoundItem