import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import "./PropertyCard.css";

const PropertyCard = ({ property }) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeToggle = (e) => {
    e.preventDefault(); // Prevent navigating to details page
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const isRupee = property.currency === "₹";

  return (
    <Link to={`/property/${property.id}`} className="property-card">
      {/* Image Showcase */}
      <div className="property-image-container">
        <img
          src={property.image}
          alt={property.title}
          className="property-image"
          loading="lazy"
        />
        
        {/* Guest favourite Badge */}
        {property.isGuestFavourite && (
          <div className="guest-favourite-badge">
            <span>Guest favourite</span>
          </div>
        )}

        {/* Heart Wishlist Button */}
        <button
          className={`wishlist-btn ${isLiked ? "liked" : ""}`}
          onClick={handleLikeToggle}
          aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className="heart-icon"
            size={20}
            fill={isLiked ? "var(--primary)" : "rgba(0, 0, 0, 0.5)"}
            stroke={isLiked ? "var(--primary)" : "#FFFFFF"}
            strokeWidth={2}
          />
        </button>
      </div>

      {/* Property Information Details */}
      {isRupee ? (
        // Rupee Style (Image 2)
        <div className="property-info rupee-style">
          <h4 className="property-location">{property.title}</h4>
          <div className="property-price-row flex-row-align">
            <span className="price-value">
              ₹{property.price.toLocaleString("en-IN")}
            </span>
            <span className="price-label"> for 2 nights</span>
            <span className="bullet-dot">•</span>
            <div className="property-rating-inline">
              <Star size={12} className="star-icon inline-star" fill="currentColor" />
              <span> {property.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      ) : (
        // Dollar Style (Image 1)
        <div className="property-info">
          <div className="property-header-row">
            <h4 className="property-location">{property.location}</h4>
            <div className="property-rating">
              <Star size={14} className="star-icon" fill="currentColor" />
              <span>{property.rating.toFixed(2)}</span>
            </div>
          </div>
          
          <p className="property-title">{property.title}</p>
          
          <div className="property-price-row">
            <span className="price-value">${property.price}</span>
            <span className="price-label"> night</span>
          </div>
        </div>
      )}
    </Link>
  );
};

export default PropertyCard;
