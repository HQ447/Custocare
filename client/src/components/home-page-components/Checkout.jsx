import React from "react";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ correct import

function Checkout() {
  const { id } = useParams();

  if (id) {
    const decoded = jwtDecode(id);
    const userId = decoded.id || decoded._id || decoded.userId;
    console.log("User ID:", userId);
  }

  return <div className="pt-20">Checkout</div>;
}

export default Checkout;
