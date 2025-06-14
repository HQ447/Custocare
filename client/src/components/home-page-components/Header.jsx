import React from "react";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  return (
    <div>
      <p>Header</p>
      <div onClick={() => navigate("/Nearby")} className="h-screen">
        Nearby
      </div>
    </div>
  );
}

export default Header;
