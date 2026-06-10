import React from "react";
import { useSearchParams } from "react-router-dom";
import { Umbrella, Mountain, Eye, Tent, Waves, Flame, Home, Gem } from "lucide-react";
import "./Categories.css";

const categoriesList = [
  { label: "Beach", icon: Umbrella },
  { label: "Mountain", icon: Mountain },
  { label: "Amazing Views", icon: Eye },
  { label: "Cabins", icon: Tent },
  { label: "Lake", icon: Waves },
  { label: "Trending", icon: Flame },
  { label: "Tiny Homes", icon: Home },
  { label: "Luxe", icon: Gem },
];

const Categories = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "";

  const handleCategoryClick = (categoryLabel) => {
    // If the category is already active, clear it. Otherwise, set it.
    if (activeCategory.toLowerCase() === categoryLabel.toLowerCase()) {
      const nextParams = Object.fromEntries(searchParams);
      delete nextParams.category;
      setSearchParams(nextParams);
    } else {
      setSearchParams({
        ...Object.fromEntries(searchParams),
        category: categoryLabel
      });
    }
  };

  return (
    <div className="categories-wrapper">
      <div className="categories-container container">
        <div className="categories-list no-scrollbar">
          {categoriesList.map((item) => {
            const Icon = item.icon;
            const isActive = activeCategory.toLowerCase() === item.label.toLowerCase();
            
            return (
              <button
                key={item.label}
                className={`category-item ${isActive ? "active" : ""}`}
                onClick={() => handleCategoryClick(item.label)}
                aria-label={`Filter by ${item.label}`}
              >
                <div className="category-icon-container">
                  <Icon size={24} strokeWidth={1.5} className="category-icon" />
                </div>
                <span className="category-label">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Categories;
