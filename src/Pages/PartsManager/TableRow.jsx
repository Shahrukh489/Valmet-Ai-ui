import React from 'react'

function TableRow(props) {

    let USDollar = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });
  return (
    <tr>
      <td key={props.item.id}>{props.item.partnumber}</td>
      <td key={props.item.id}>
        <img
          src={`https://stasptusedvapp.blob.core.windows.net/part-images/${props.item.partnumber}.JPG`}
          alt={props.name}
          style={{ height: "40px", width: "50px" }}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/No_Image_Available.jpg";
          }}
        />
        {/* <img
          src="/2021784-001.jpg"
          alt=""
          style={{ height: "40px", width: "50px" }}
        /> */}
      </td>
      <td key={props.item.id}>{props.item.description}</td>
      <td key={props.item.id}>{USDollar.format(props.item.price)}</td>
      <td key={props.item.id} style={{ textTransform: "uppercase" }}>
        {props.item.ved}
      </td>
      <td key={props.item.id} style={{ textTransform: "uppercase" }}>
        {props.item.atonStatus}
      </td>
      <td key={props.item.id} style={{ textTransform: "uppercase" }}>
        {props.item.maxum}
      </td>
      <td key={props.item.id} style={{ textTransform: "uppercase" }}>
        {props.item.mlfb}
      </td>
      <td key={props.item.id} style={{ textTransform: "uppercase" }}>
        {props.item.category}
      </td>
      <td>{props.item.gcCategory}</td>
      <td>{props.item.note}</td>
      <td>{props.item.internalNote}</td>
      <td>N/A</td>
      <td>N/A</td>
    </tr>
  );
}

export default TableRow