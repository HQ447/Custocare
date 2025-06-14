import React from "react";
import Hero from "./Hero";
import NearbyRestaurants from "./NearbyRes";
import Foods from "./Foods";

function Header() {
  return (
    <div className="flex flex-col">
      <Hero />

      <div>
        <NearbyRestaurants />
      </div>

      <Foods />
    </div>
  );
}

export default Header;
