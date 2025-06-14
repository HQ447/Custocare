import React from "react";
import { useParams } from "react-router-dom";

function Checkout() {
  const { id } = useParams();
  return <div>Checkout</div>;
}

export default Checkout;
