import React, {useState} from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import SearchBar from '../../../components/SearchBarComp/SearchBar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
// import ListView from '../../ColumnConfigurator/ListView';
import FoundItem from './FoundItem';
import { FaStar } from "react-icons/fa";

function UpdateItem() {
     const [itemToUpdate, setItemToUpdate] = useState(null);
     const [showModal, setShowModal] = useState(false);
     const [showEditForm, setShowEditForm] = useState(false);

     function getSearchedPart(data) {
       if (data) {
         setItemToUpdate(data);
         setShowEditForm(true); // Show the edit form if an item is found
       } else {
         setItemToUpdate(null);
         setShowModal(true); // Show the not found modal if no results are found
       }
     }

     const handleItemClick = () => {
       alert("Item clicked!");
     };
  return (
    <Card>
      <Card.Body>
        <Card.Title>Update Item</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          Make Changes to Item Details
        </Card.Subtitle>
        <Card.Text>
          <div className="mb-3" style={{ marginTop: "20px" }}>
            <SearchBar
              placeholder="Enter Part Number"
              tag="priceupdate"
              part={getSearchedPart}
            />
          </div>
          {/* React Bootstrap Modal for result not found */}
          <Modal show={showModal} centered onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>There Was a Problem</Modal.Title>
            </Modal.Header>
            <Modal.Body>Result not found</Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={() => setShowModal(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>

          {/* EditForm Component */}
          {itemToUpdate && (
            // <ListView
            //   key={itemToUpdate.partnumber}
            //   id={itemToUpdate.partnumber}
            //   partNumber={itemToUpdate.partnumber}
            //   name={itemToUpdate.description}
            //   price={itemToUpdate.price}
            //   mlfb={itemToUpdate.mlfb}
            //   category={itemToUpdate.category}
            //   note={itemToUpdate.note}
            //   gcCategory={itemToUpdate.gcCategory}
            // />

            <FoundItem
                key={itemToUpdate.partnumber}
                id={itemToUpdate.partnumber}
                partNumber={itemToUpdate.partnumber}
                name={itemToUpdate.description}
                price={itemToUpdate.price}
                mlfb={itemToUpdate.mlfb}
                category={itemToUpdate.category}
                note={itemToUpdate.note}
                gcCategory={itemToUpdate.gcCategory}
            />
          )}
        </Card.Text>
        {/* <Card.Link href="#">Card Link</Card.Link>
        <Card.Link href="#">Another Link</Card.Link> */}
      </Card.Body>
    </Card>
  );
}

export default UpdateItem