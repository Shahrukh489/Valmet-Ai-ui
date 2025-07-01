
import data from "../../mock/data.json";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

import TableRowComponent from "./TableRowComponent";

function TableComp(props) {
  const filteredData = data.filter((val) => {
    if (props.search === "") {
      return val;
    } else if (
      val.item_name.toLowerCase().includes(props.search.toLowerCase())
    ) {
      return val;
    }
  });

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item Name</TableHead>
            <TableHead>Price</TableHead>
          </TableRow>
        </TableHeader>
        
        <TableBody>
          {filteredData.map((item) => (
            <TableRowComponent key={item.id} item={item} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default TableComp;
