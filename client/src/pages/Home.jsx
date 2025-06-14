import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col">
      <Navbar />

      <div className=" min-h-screen">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default Home;
