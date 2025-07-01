// UpdatePrice.js
import React, { useState } from "react";
import { AlertCircle } from "lucide-react";

import SearchBar from "../../../components/SearchBarComp/SearchBar";
import EditUpdateForm from "./EditUpdateForm"; // Import the EditForm component
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import ListView from "../../SpareParts/ListView";

function UpdatePrice() {
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

  const handleCloseEditForm = () => setShowEditForm(false);
  const handleSave = (updatedItem) => {
    console.log("Updated item:", updatedItem);
    // Handle save logic here (e.g., API call to save updated item)
    handleCloseEditForm(); // Close the form after saving
  };

  return (
    <div>
      <div className="mb-3">
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
        <ListView
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
    </div>
  );
}

export default UpdatePrice;
