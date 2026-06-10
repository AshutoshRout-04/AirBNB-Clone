function PropertyCard({ property }) {
  return (
    <div className="property-card">
      <img
        src="https://picsum.photos/400/300"
        alt="property"
        className="property-image"
      />

      <div className="property-content">
        <h3>{property.title}</h3>

        <p className="location">
          {property.location}
        </p>

        <p className="details">
          {property.bedrooms} bed · {property.maxGuests} guests
        </p>

        <p className="price">
          ₹{property.pricePerNight} night
        </p>
      </div>
    </div>
  );
}

export default PropertyCard;