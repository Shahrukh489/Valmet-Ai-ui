import React from 'react'
import relationalData from "../../mock/relational_data.json"

function ListItemPart(props) {
    
    const part = relationalData?.find((part)=> part.part_number === props.part_number)
    console.log(part);
  return (
    <div>
        <h1>cool</h1>
    </div>
  )
}

export default ListItemPart