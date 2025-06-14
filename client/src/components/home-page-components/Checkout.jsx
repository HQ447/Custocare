import React from "react";
import { useParams } from "react-router-dom";

function Checkout() {
  const { id } = useParams();
  console.log(id);
  return <div>Checkout</div>;
}

export default Checkout;
