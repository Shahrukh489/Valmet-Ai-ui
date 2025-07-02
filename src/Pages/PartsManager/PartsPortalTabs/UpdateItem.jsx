import React, {useState} from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import SearchBar from '../../../components/SearchBarComp/SearchBar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import FoundItem from './FoundItem';
import { AlertCircle, Search } from "lucide-react";

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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Search className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Update Item</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Search for a part and make changes to item details
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <SearchBar
              placeholder="Enter Part Number"
              tag="priceupdate"
              part={getSearchedPart}
            />
          </div>
        </CardContent>
      </Card>

      {/* Not Found Dialog */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
              <DialogTitle>Part Not Found</DialogTitle>
            </div>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              No part was found with the provided part number. Please check the part number and try again.
            </p>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Found Item */}
      {itemToUpdate && (
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
    </div>
  );
}

export default UpdateItem