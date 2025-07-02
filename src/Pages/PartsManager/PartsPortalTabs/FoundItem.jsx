import React, {useState} from 'react'
import PropTypes from "prop-types";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Edit2, Package, DollarSign, Upload } from "lucide-react";
import { LoadingSpinner } from "../../../components/ui/loading-spinner";
import { useTranslation } from "react-i18next";


function FoundItem(props) {
    const { t } = useTranslation('global');
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
      partNumber: props.partNumber || '',
      name: props.name || '',
      price: props.price || '',
      mlfb: props.mlfb || '',
      category: props.category || '',
      image: null
    });

    const handleEdit = () => setShowModal(true);
    const handleClose = () => {
      setShowModal(false);
      // Reset form data to original values
      setFormData({
        partNumber: props.partNumber || '',
        name: props.name || '',
        price: props.price || '',
        mlfb: props.mlfb || '',
        category: props.category || '',
        image: null
      });
    };

    const handleInputChange = (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log("Item updated:", formData);
        // TODO: Add real API call to update the item
        handleClose();
      } catch (error) {
        console.error("Error updating item:", error);
      } finally {
        setIsLoading(false);
      }
    };

    let USDollar = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });
   
  return (
    <>
      <Card className="animate-fade-in">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <Package className="h-5 w-5 text-success" />
            </div>
            <div>
              <CardTitle className="text-lg">Item Found</CardTitle>
              <p className="text-sm text-muted-foreground">Part details ready for editing</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Part No</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>MLFB</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">{props.partNumber}</TableCell>
                  <TableCell>{props.name}</TableCell>
                  <TableCell>{USDollar.format(props.price)}</TableCell>
                  <TableCell className="uppercase">{props.mlfb}</TableCell>
                  <TableCell className="uppercase">{props.category}</TableCell>
                  <TableCell>
                    <Button onClick={handleEdit} size="sm" className="flex items-center gap-2">
                      <Edit2 className="h-4 w-4" />
                      Edit Item
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl animate-scale-in">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Edit2 className="h-5 w-5 text-primary" />
              </div>
              <DialogTitle>Edit Item Details</DialogTitle>
            </div>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="partNumber">Part Number</Label>
                <Input
                  id="partNumber"
                  value={formData.partNumber}
                  onChange={(e) => handleInputChange('partNumber', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    className="pl-10"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Description</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mlfb">MLFB</Label>
                <Input
                  id="mlfb"
                  value={formData.mlfb}
                  onChange={(e) => handleInputChange('mlfb', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Upload Image</Label>
              <div className="relative">
                <Upload className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="pl-10"
                  onChange={(e) => handleInputChange('image', e.target.files[0])}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  {t('partsManager.saving')}
                </>
              ) : (
                t('partsManager.saveChanges')
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

FoundItem.propTypes = {
  partNumber: PropTypes.string,
  name: PropTypes.string,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  mlfb: PropTypes.string,
  category: PropTypes.string,
  id: PropTypes.string,
  note: PropTypes.string,
  gcCategory: PropTypes.string
};

export default FoundItem