import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet, useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col">
      <Navbar />

      <div onClick={() => navigate("/Nearby")} className="px-20">
        Nearby
      </div>
      <Outlet />
      <Footer />
    </div>
  );
}

export default Home;
