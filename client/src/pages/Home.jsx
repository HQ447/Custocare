import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NearbyRestaurants from "./NearbyRes";

function Home() {
  return (
    <div className="flex flex-col">
      <Navbar />

      <NearbyRestaurants />
      <div className="px-20">this is body</div>

      <Footer />
    </div>
  );
}

export default Home;
