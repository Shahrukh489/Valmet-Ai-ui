// EditUpdateForm.js
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label"; // Ensure Bootstrap CSS is imported

function EditUpdateForm({ show, handleClose, item, handleSave }) {
  const [formData, setFormData] = useState({});

  // Initialize formData with item details
  useEffect(() => {
    if (item) {
      setFormData({ ...item });
    }
  }, [item]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave(formData); // Pass the updated data to the parent component
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {Object.keys(formData).map((key) => (
            <Form.Group controlId={`form${key}`} key={key}>
              <Form.Label>{key}</Form.Label>
              <Form.Control
                type={typeof formData[key] === "number" ? "number" : "text"}
                name={key}
                value={formData[key] || ""}
                onChange={handleInputChange}
                placeholder={`Enter ${key}`}
                required={key === "partNumber"} // Example: Make 'partNumber' required
              />
            </Form.Group>
          ))}
          <div className="d-flex justify-content-end mt-3">
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button type="submit" variant="primary" className="ml-2">
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default EditUpdateForm;
