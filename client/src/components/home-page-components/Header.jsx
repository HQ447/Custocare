import React from "react";
import Hero from "./Hero";
import NearbyRestaurants from "./NearbyRes";
import Foods from "./Foods";
import Testimonials from "./Testimonials";

function Header() {
  return (
    <div className="flex flex-col">
      <Hero />

      <div>
        <NearbyRestaurants />
      </div>

      <Foods />

      <Testimonials />
    </div>
  );
}

export default Header;
