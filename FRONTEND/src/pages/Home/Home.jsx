import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
import { properties } from "../../data/properties";
import { SlidersHorizontal, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import "./Home.css";

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredProperties, setFilteredProperties] = useState(properties);

  const activeTab = searchParams.get("tab") || "All";
  const searchQuery = searchParams.get("search") || "";
  const guestsParam = parseInt(searchParams.get("guests") || "1");

  // Refs for horizontal scrolling carousels
  const kolkataRef = useRef(null);
  const puriRef = useRef(null);
  const otherRef = useRef(null);

  useEffect(() => {
    let result = properties;

    // Filter by Tab (All, Homes, Experiences, Services)
    if (activeTab && activeTab !== "All") {
      result = result.filter(
        (p) => p.type && p.type.toLowerCase() === activeTab.toLowerCase()
      );
    }

    // Filter by Search Query (Title or Location or Category)
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.location.toLowerCase().includes(query) ||
          p.title.toLowerCase().includes(query) ||
          (p.category && p.category.toLowerCase().includes(query))
      );
    }

    // Filter by Guest Count
    if (guestsParam > 1) {
      result = result.filter((p) => p.guests >= guestsParam);
    }

    setFilteredProperties(result);
  }, [activeTab, searchQuery, guestsParam]);

  const clearFilters = () => {
    setSearchParams({ tab: activeTab });
  };

  // Carousel scroll handler
  const scrollContainer = (ref, direction) => {
    if (ref.current) {
      const cardWidth = 320; // Approx card width + gap
      const scrollAmount = direction === "left" 
        ? -cardWidth * 2 
        : cardWidth * 2;
      ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Group listings for sections (when no search query is active)
  const kolkataProperties = filteredProperties.filter((p) =>
    p.location.toLowerCase().includes("kolkata")
  );
  
  const puriProperties = filteredProperties.filter((p) =>
    p.location.toLowerCase().includes("puri")
  );
  
  const otherProperties = filteredProperties.filter(
    (p) =>
      !p.location.toLowerCase().includes("kolkata") &&
      !p.location.toLowerCase().includes("puri")
  );

  // Determine if we should show sections or a single unified grid
  // We show a single grid if a search query is active OR if the active tab is not All/Homes (e.g. Experiences/Services)
  const showSections = !searchQuery && (activeTab === "All" || activeTab === "Homes");

  return (
    <main className="home-page-wrapper">
      {showSections ? (
        <div className="home-sections-container">
          {/* Section 1: Kolkata */}
          {kolkataProperties.length > 0 && (
            <section className="home-carousel-section container">
              <div className="carousel-header">
                <div className="carousel-title-group">
                  <h2>Popular homes in Kolkata</h2>
                  <button className="title-arrow-btn" aria-label="See all Kolkata homes">
                    <ArrowRight size={16} />
                  </button>
                </div>
                <div className="carousel-nav-arrows">
                  <button 
                    className="arrow-btn" 
                    onClick={() => scrollContainer(kolkataRef, "left")}
                    aria-label="Scroll left"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button 
                    className="arrow-btn" 
                    onClick={() => scrollContainer(kolkataRef, "right")}
                    aria-label="Scroll right"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
              <div className="carousel-track-container" ref={kolkataRef}>
                <div className="carousel-track">
                  {kolkataProperties.map((property) => (
                    <div className="carousel-card-wrapper" key={property.id}>
                      <PropertyCard property={property} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Section 2: Puri */}
          {puriProperties.length > 0 && (
            <section className="home-carousel-section container">
              <div className="carousel-header">
                <div className="carousel-title-group">
                  <h2>Available in Puri this weekend</h2>
                  <button className="title-arrow-btn" aria-label="See all Puri homes">
                    <ArrowRight size={16} />
                  </button>
                </div>
                <div className="carousel-nav-arrows">
                  <button 
                    className="arrow-btn" 
                    onClick={() => scrollContainer(puriRef, "left")}
                    aria-label="Scroll left"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button 
                    className="arrow-btn" 
                    onClick={() => scrollContainer(puriRef, "right")}
                    aria-label="Scroll right"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
              <div className="carousel-track-container" ref={puriRef}>
                <div className="carousel-track">
                  {puriProperties.map((property) => (
                    <div className="carousel-card-wrapper" key={property.id}>
                      <PropertyCard property={property} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Section 3: Recommended International Stays */}
          {otherProperties.length > 0 && (
            <section className="home-carousel-section container">
              <div className="carousel-header">
                <div className="carousel-title-group">
                  <h2>Recommended international stays</h2>
                  <button className="title-arrow-btn" aria-label="See all international stays">
                    <ArrowRight size={16} />
                  </button>
                </div>
                <div className="carousel-nav-arrows">
                  <button 
                    className="arrow-btn" 
                    onClick={() => scrollContainer(otherRef, "left")}
                    aria-label="Scroll left"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button 
                    className="arrow-btn" 
                    onClick={() => scrollContainer(otherRef, "right")}
                    aria-label="Scroll right"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
              <div className="carousel-track-container" ref={otherRef}>
                <div className="carousel-track">
                  {otherProperties.map((property) => (
                    <div className="carousel-card-wrapper" key={property.id}>
                      <PropertyCard property={property} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      ) : (
        // Grid View for Search Results / Other Tabs
        <div className="search-grid-container">
          <div className="home-grid-header container">
            <div className="search-stats">
              {searchQuery && (
                <p className="stats-text">
                  Showing {filteredProperties.length} results for "<strong>{searchQuery}</strong>"
                  {activeTab && activeTab !== "All" && ` in ${activeTab}`}
                </p>
              )}
              {!searchQuery && (
                <p className="stats-text">
                  Showing {filteredProperties.length} {activeTab.toLowerCase()} options
                </p>
              )}
            </div>

            <button className="filters-toggle-btn" aria-label="Filters">
              <SlidersHorizontal size={16} />
              <span>Filters</span>
            </button>
          </div>

          <section className="property-grid-section container">
            {filteredProperties.length > 0 ? (
              <div className="property-grid">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="no-results-card">
                <h3>No results found</h3>
                <p>Try changing your filters or searching for something else.</p>
                <button className="clear-filters-btn" onClick={clearFilters}>
                  Clear all filters
                </button>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
};

export default Home;
