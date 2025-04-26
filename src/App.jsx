import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import DetailsPage from "./pages/DetailsPage";
import Footer from "./components/Footer";
import Movies from "./pages/Movies";
import Shows from "./pages/Shows";
import People from "./pages/People";
import Search from "./pages/Search";
import Person from "./pages/Person";
import BottomNav from "./components/BottomNav"; // ახალი დამატება

export const App = () => {
  return (
    <>
      <div className="bg-[#1a1c29] min-h-screen text-white pt-20 ">
        <div className="hidden md:block">
          <Navbar />
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:type/:id" element={<DetailsPage />} />
          <Route path="/movies/" element={<Movies />} />
          <Route path="/shows/" element={<Shows />} />
          <Route path="/person/:id" element={<Person />} />
          <Route path="/people/" element={<People />} />
          <Route path="/search/" element={<Search />} />
        </Routes>
        <Footer />
        <div className="md:hidden">
          <BottomNav />
        </div>
      </div>
    </>
  );
};

export default App;
