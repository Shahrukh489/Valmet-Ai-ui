import React from "react";
import TableComp from "../../components/TableComp/TableComp";

function SearchListViewPage(props) {
  return (
    <div className="w-full">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <TableComp search={props.search} />
      </div>
    </div>
  );
}

export default SearchListViewPage;