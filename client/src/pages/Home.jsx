import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {
  return (
    <div className="flex flex-col">
      <Navbar />

      <div className="px-20">this is body</div>

      <Footer />
    </div>
  );
}

export default Home;
