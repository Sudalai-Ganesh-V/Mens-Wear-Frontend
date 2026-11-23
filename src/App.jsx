
import Navbar from "./components/Navbar";
import CategoryBanner from "./components/CategoryBanner";
import FilterSidebar from "./components/FilterSidebar";
import "./App.css";

function App() {
  return (
    <>
      <Navbar />

      <CategoryBanner />

      <main className="catalog-layout">
        <FilterSidebar />
      </main>
    </>
  );
}

export default App;
