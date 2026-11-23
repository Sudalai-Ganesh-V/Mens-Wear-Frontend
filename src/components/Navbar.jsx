
import React from "react";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">MDB</div>

      <div className="search-box">
        <input type="text" placeholder="Search" />
        <button className="search-btn">🔍</button>
      </div>

      <div className="nav-actions">
        <button className="nav-btn">👤 Sign in</button>
        <button className="nav-btn">♥ Wishlist</button>
        <button className="nav-btn">🛒 My cart</button>
      </div>
    </nav>
  );
}

export default Navbar;
