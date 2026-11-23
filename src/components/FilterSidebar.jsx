
import React from "react";

function FilterSidebar() {
  const relatedItems = [
    "Electronics",
    "Home items",
    "Books, Magazines",
    "Men's clothing",
    "Interiors items",
    "Underwears",
    "Shoes for men",
    "Accessories"
  ];

  const brands = [
    ["Mercedes", 120],
    ["Toyota", 15],
    ["Mitsubishi", 95],
    ["Nissan", 89],
    ["Honda", 30],
    ["Suzuki", 50]
  ];

  const sizes = ["XS", "SM", "LG", "XL"];

  return (
    <aside className="filter-sidebar">

      {/* Related Items */}
      <section className="filter-section">
        <div className="filter-heading">
          <h3>Related items</h3>
          <span>⌃</span>
        </div>

        {relatedItems.map((item) => (
          <div className="related-item" key={item}>
            {item}
          </div>
        ))}
      </section>

      {/* Brands */}
      <section className="filter-section">
        <div className="filter-heading">
          <h3>Brands</h3>
          <span>⌃</span>
        </div>

        {brands.map(([brand, count], index) => (
          <label className="brand-option" key={brand}>
            <input type="checkbox" defaultChecked={index < 4} />
            <span>{brand}</span>
            <small>{count}</small>
          </label>
        ))}
      </section>

      {/* Price */}
      <section className="filter-section">
        <div className="filter-heading">
          <h3>Price</h3>
          <span>⌃</span>
        </div>

        <input
          className="price-range"
          type="range"
          min="0"
          max="2000"
          defaultValue="1000"
        />

        <div className="price-inputs">
          <div>
            <small>Min</small>
            <input type="text" defaultValue="$0" />
          </div>

          <div>
            <small>Max</small>
            <input type="text" defaultValue="$1,000" />
          </div>
        </div>

        <button className="apply-button">APPLY</button>
      </section>

      {/* Size */}
      <section className="filter-section">
        <div className="filter-heading">
          <h3>Size</h3>
          <span>⌃</span>
        </div>

        <div className="size-options">
          {sizes.map((size) => (
            <button key={size}>{size}</button>
          ))}
        </div>
      </section>

      {/* Ratings */}
      <section className="filter-section rating-section">
        <div className="filter-heading">
          <h3>Ratings</h3>
          <span>⌃</span>
        </div>

        {[5, 4, 3, 2].map((rating) => (
          <label className="rating-option" key={rating}>
            <input type="checkbox" defaultChecked />
            <span className="stars">
              {"★".repeat(rating)}
              <span className="empty-stars">
                {"★".repeat(5 - rating)}
              </span>
            </span>
          </label>
        ))}
      </section>

    </aside>
  );
}

export default FilterSidebar;
