import React, { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SparePartsExcelInput = () => {
  const emptyRow = {
    Partnumber: "",
    Description: "",
    Price: "",
    RefP: "",
    Costs: "",
    Ved: "",
    AtonStatus: "",
    Maxum: "",
    Mlfb: "",
    ItemCategory: "",
    ProductCategory: "",
    SubProductCategory: "",
    Note: "",
    InternalNote: "",
    SalesText: "",
    MinWh: "",
    PricePmd: "",
  };

  const [rows, setRows] = useState([emptyRow]);
  const [activeCell, setActiveCell] = useState({
    rowIndex: null,
    colIndex: null,
    value: "",
  });

  const handleInputChange = (index, field, value) => {
    setRows(
      rows.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row
      )
    );
  };

  const addRow = () => setRows([...rows, { ...emptyRow }]);

  const removeRow = (index) =>
    setRows(rows.filter((_, rowIndex) => rowIndex !== index));

  const handleSave = () => {
    console.log(rows);
    // API Call to backend
  };

  const handlePaste = useCallback(
    (event, rowIndex, colIndex) => {
      const clipboardData = event.clipboardData.getData("text/plain");
      const pastedRows = clipboardData
        .trim()
        .split("\n")
        .map((row) => row.split("\t"));

      const fields = Object.keys(emptyRow);

      setRows((prevRows) => {
        const updatedRows = [...prevRows];

        pastedRows.forEach((rowCells, pastedRowIndex) => {
          const currentRowIndex = rowIndex + pastedRowIndex;
          if (currentRowIndex < updatedRows.length) {
            rowCells.forEach((cellValue, pastedColIndex) => {
              const currentColIndex = colIndex + pastedColIndex;
              if (currentColIndex < fields.length) {
                const field = fields[currentColIndex];
                updatedRows[currentRowIndex][field] = cellValue;
              }
            });
          }
        });

        return updatedRows;
      });

      event.preventDefault();
    },
    [emptyRow]
  );

  const fields = Object.keys(emptyRow);

  const handleActiveCellChange = (value) => {
    if (activeCell.rowIndex !== null && activeCell.colIndex !== null) {
      const field = fields[activeCell.colIndex];
      handleInputChange(activeCell.rowIndex, field, value);
      setActiveCell({ ...activeCell, value });
    }
  };

  return (
    <div className="p-4 overflow-x-auto">
      <Input
        className="mb-4"
        placeholder="Edit cell value"
        value={activeCell.value}
        onChange={(e) => handleActiveCellChange(e.target.value)}
      />

      <Table>
        <TableHeader>
          <TableRow>
            {fields.map((field) => (
              <TableHead key={field}>{field}</TableHead>
            ))}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {fields.map((field, colIndex) => (
                <TableCell key={field}>
                  <Input
                    value={row[field]}
                    onChange={(e) =>
                      handleInputChange(rowIndex, field, e.target.value)
                    }
                    placeholder={field}
                    onFocus={() =>
                      setActiveCell({ rowIndex, colIndex, value: row[field] })
                    }
                    onPaste={(e) => handlePaste(e, rowIndex, colIndex)}
                  />
                </TableCell>
              ))}
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeRow(rowIndex)}
                >
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex gap-2 mt-4">
        <Button variant="outline" onClick={addRow}>
          + Add Row
        </Button>
        <Button onClick={handleSave}>Save Parts</Button>
      </div>
    </div>
  );
};

export default SparePartsExcelInput;
