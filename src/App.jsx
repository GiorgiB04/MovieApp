import React from "react";
import { Route, Routes } from "react-router-dom";
import { useParams } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import DetailsPage from "./pages/DetailsPage";
import Footer from "./components/Footer";
import Movies from "./pages/Movies";
import Shows from "./pages/Shows";
import Search from "./pages/Search";

export const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:type/:id" element={<DetailsPage />} />
        <Route path="/movies/" element={<Movies />} />
        <Route path="/shows/" element={<Shows />} />
        <Route path="/search/" element={<Search />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
