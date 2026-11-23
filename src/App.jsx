import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import CategoryBanner from "./components/CategoryBanner";
import FilterSidebar from "./components/FilterSidebar";

function App() {
  return (
    <div className="page">

      <Navbar />

      <CategoryBanner />

      <FilterSidebar />

    </div>
  );
}

export default App;
