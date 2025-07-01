import React from "react";
import { useStateValue } from "../../Redux/stateProvider";
import CardComp from "../../components/CardComponent/CardComp";

import data from "../../mock/temp_data.json";

function DefaultGridView(props) {
  const [{ basket }, dispatch] = useStateValue();

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredData.map((val) => (
        <CardComp
          key={val.id}
          id={val.id}
          name={val.item_name}
          image={val.image}
          price={val.price}
        />
      ))}
    </div>
  );
}

export default DefaultGridView;
