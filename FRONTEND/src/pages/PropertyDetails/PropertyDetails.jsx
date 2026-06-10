import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, Heart, Share, ShieldCheck, Calendar, Users, Award, MapPin, Wifi, Airplay, Coffee, Tv, TreePine } from "lucide-react";
import { properties } from "../../data/properties";
import "./PropertyDetails.css";

const PropertyDetails = () => {
  const { id } = useParams();
  const property = properties.find((p) => p.id === parseInt(id));

  // Default booking dates (Check-in tomorrow, Check-out 5 days later)
  const getFormattedDate = (daysAhead) => {
    const date = new Date();
    date.setDate(date.getDate() + daysAhead);
    return date.toISOString().split("T")[0];
  };

  const [checkIn, setCheckIn] = useState(getFormattedDate(1));
  const [checkOut, setCheckOut] = useState(getFormattedDate(6));
  const [guestsCount, setGuestsCount] = useState(2);
  const [nights, setNights] = useState(5);
  const [isLiked, setIsLiked] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Recalculate nights when check-in or check-out dates change
  useEffect(() => {
    const date1 = new Date(checkIn);
    const date2 = new Date(checkOut);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (date2 > date1) {
      setNights(diffDays);
    } else {
      setNights(1); // Minimum 1 night
    }
  }, [checkIn, checkOut]);

  if (!property) {
    return (
      <div className="error-page container">
        <h2>Property not found</h2>
        <p>The home you are looking for does not exist or has been removed.</p>
        <Link to="/" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to Homepage</span>
        </Link>
      </div>
    );
  }

  // Cost calculations
  const isRupee = property.currency === "₹";
  const accommodationTotal = property.price * nights;
  const cleaningFee = isRupee ? 1500 : 60;
  const serviceFee = Math.round(accommodationTotal * 0.14);
  const totalCost = accommodationTotal + cleaningFee + serviceFee;

  const formatPrice = (amount) => {
    const currency = property.currency || "$";
    if (currency === "₹") {
      return `₹${amount.toLocaleString("en-IN")}`;
    }
    return `$${amount.toLocaleString("en-US")}`;
  };

  const handleReserve = (e) => {
    e.preventDefault();
    setBookingConfirmed(true);
  };

  return (
    <div className="property-details-wrapper">
      <div className="details-container container">
        {/* Navigation Bar */}
        <div className="details-header-nav">
          <Link to="/" className="back-link">
            <ArrowLeft size={18} />
            <span>Homes</span>
          </Link>

          <div className="action-buttons">
            <button className="nav-action-btn">
              <Share size={16} />
              <span>Share</span>
            </button>
            <button 
              className={`nav-action-btn ${isLiked ? "liked" : ""}`} 
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart size={16} fill={isLiked ? "var(--primary)" : "transparent"} stroke={isLiked ? "var(--primary)" : "currentColor"} />
              <span>{isLiked ? "Saved" : "Save"}</span>
            </button>
          </div>
        </div>

        {/* Title and Ratings */}
        <section className="details-title-section">
          <h1>{property.title}</h1>
          <div className="meta-info-row">
            <div className="rating-location-info">
              <span className="meta-rating">
                <Star size={16} fill="currentColor" />
                <span>{property.rating}</span>
              </span>
              <span className="separator">·</span>
              <span className="meta-reviews">14 reviews</span>
              <span className="separator">·</span>
              <span className="meta-location">
                <MapPin size={14} className="map-icon" />
                <a href="#map">{property.location}</a>
              </span>
            </div>
          </div>
        </section>

        {/* Image Grid */}
        <section className="details-images-section">
          <div className="images-grid">
            <div className="large-image-col">
              <img src={property.image} alt={property.title} className="detail-img main-img" />
            </div>
            <div className="small-images-col">
              <img 
                src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80" 
                alt="Room detail 1" 
                className="detail-img side-img-top" 
              />
              <img 
                src="https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=600&q=80" 
                alt="Room detail 2" 
                className="detail-img side-img-bottom" 
              />
            </div>
          </div>
        </section>

        {/* Content Section: 2 Columns */}
        <div className="details-content-grid">
          {/* Left Column: Info, Host, Amenities */}
          <div className="details-info-column">
            <div className="host-profile-section">
              <div className="host-details">
                <h2>Entire cabin hosted by {property.host.name}</h2>
                <p className="specs-list">
                  <span>{property.guests} guests</span>
                  <span className="bullet">·</span>
                  <span>{property.bedrooms} bedrooms</span>
                  <span className="bullet">·</span>
                  <span>{property.beds} beds</span>
                  <span className="bullet">·</span>
                  <span>{property.bathrooms} baths</span>
                </p>
              </div>
              <img 
                src={property.host.avatar} 
                alt={property.host.name} 
                className="host-avatar" 
              />
            </div>

            <hr className="section-divider" />

            {/* Superhost / Highlights badges */}
            <div className="highlights-list">
              {property.host.isSuperhost && (
                <div className="highlight-item">
                  <Award className="highlight-icon" size={28} />
                  <div>
                    <h3>{property.host.name} is a Superhost</h3>
                    <p>Superhosts are experienced, highly rated hosts who are committed to providing great stays.</p>
                  </div>
                </div>
              )}
              <div className="highlight-item">
                <Calendar className="highlight-icon" size={28} />
                <div>
                  <h3>Free cancellation</h3>
                  <p>Free cancellation for 48 hours. Cancel before check-in for a full refund.</p>
                </div>
              </div>
              <div className="highlight-item">
                <ShieldCheck className="highlight-icon" size={28} />
                <div>
                  <h3>Great check-in experience</h3>
                  <p>100% of recent guests gave the check-in process a 5-star rating.</p>
                </div>
              </div>
            </div>

            <hr className="section-divider" />

            {/* Description */}
            <div className="description-section">
              <h3>About this space</h3>
              <p className="description-text">{property.description}</p>
            </div>

            <hr className="section-divider" />

            {/* Amenities */}
            <div className="amenities-section">
              <h3>What this place offers</h3>
              <div className="amenities-grid">
                <div className="amenity-item">
                  <Wifi size={20} />
                  <span>Fast wifi (500 Mbps)</span>
                </div>
                <div className="amenity-item">
                  <Airplay size={20} />
                  <span>Central air conditioning</span>
                </div>
                <div className="amenity-item">
                  <Coffee size={20} />
                  <span>Coffee maker</span>
                </div>
                <div className="amenity-item">
                  <Tv size={20} />
                  <span>HDTV with Netflix</span>
                </div>
                <div className="amenity-item">
                  <TreePine size={20} />
                  <span>Private garden backyard</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Booking Form */}
          <div className="details-booking-column">
            <div className="booking-card">
              <div className="booking-price-header">
                <div>
                  <span className="booking-price">{formatPrice(property.price)}</span>
                  <span className="booking-price-label"> night</span>
                </div>
                <div className="booking-rating">
                  <Star size={14} fill="currentColor" />
                  <span className="rating-value">{property.rating}</span>
                  <span className="rating-count">· 14 reviews</span>
                </div>
              </div>

              <form className="booking-form" onSubmit={handleReserve}>
                <div className="inputs-group">
                  <div className="date-inputs">
                    <div className="date-input-box border-right">
                      <label htmlFor="checkin">CHECK-IN</label>
                      <input 
                        type="date" 
                        id="checkin" 
                        value={checkIn}
                        min={getFormattedDate(1)}
                        onChange={(e) => setCheckIn(e.target.value)}
                        required
                      />
                    </div>
                    <div className="date-input-box">
                      <label htmlFor="checkout">CHECKOUT</label>
                      <input 
                        type="date" 
                        id="checkout" 
                        value={checkOut}
                        min={checkIn}
                        onChange={(e) => setCheckOut(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="guests-input">
                    <label htmlFor="guests">GUESTS</label>
                    <select 
                      id="guests" 
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(parseInt(e.target.value))}
                    >
                      <option value="1">1 guest</option>
                      <option value="2">2 guests</option>
                      <option value="3">3 guests</option>
                      <option value="4">4 guests</option>
                      <option value="5">5 guests</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="reserve-btn">
                  Reserve
                </button>
              </form>

              <p className="no-charge-text">You won't be charged yet</p>

              {/* Price calculations */}
              <div className="cost-breakdown-section">
                <div className="cost-row">
                  <span className="cost-label">{formatPrice(property.price)} x {nights} nights</span>
                  <span className="cost-amount">{formatPrice(accommodationTotal)}</span>
                </div>
                <div className="cost-row">
                  <span className="cost-label">Cleaning fee</span>
                  <span className="cost-amount">{formatPrice(cleaningFee)}</span>
                </div>
                <div className="cost-row">
                  <span className="cost-label">Airbnb service fee</span>
                  <span className="cost-amount">{formatPrice(serviceFee)}</span>
                </div>
                <hr className="cost-divider" />
                <div className="cost-row total-row">
                  <span>Total before taxes</span>
                  <span>{formatPrice(totalCost)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Confirmation Dialog Modal */}
      {bookingConfirmed && (
        <div className="booking-modal-overlay">
          <div className="booking-modal-content">
            <div className="success-checkmark">
              <ShieldCheck size={48} color="var(--primary)" />
            </div>
            <h2>Booking Confirmed!</h2>
            <p className="modal-description">
              Congratulations! Your reservation at <strong>{property.title}</strong> is complete.
            </p>
            <div className="booking-summary">
              <div className="summary-row">
                <span>Location:</span>
                <strong>{property.location}</strong>
              </div>
              <div className="summary-row">
                <span>Dates:</span>
                <strong>{checkIn} to {checkOut} ({nights} nights)</strong>
              </div>
              <div className="summary-row">
                <span>Guests:</span>
                <strong>{guestsCount} guests</strong>
              </div>
              <div className="summary-row">
                <span>Total amount paid:</span>
                <strong className="summary-total">{formatPrice(totalCost)}</strong>
              </div>
            </div>
            <button className="close-modal-btn" onClick={() => setBookingConfirmed(false)}>
              Awesome!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;
