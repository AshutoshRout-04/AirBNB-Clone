function PropertyCard({ property }) {
  return (
    <div style={{
        border: "1px solid #ccc",
        boxShadow: "15px 15px 30px rgba(0,0,0,0.1)",
        padding: "15px",
        margin: "10px",
        borderRadius: "10px",
        width: "300px"
      }}>
        
      <h2>{property.title}</h2>
      <p>{property.description}</p>
      <p>{property.location}</p>
      <p>₹{property.pricePerNight}</p>
      <p>Max guests: {property.maxGuests}</p>
      <p>Bedrooms: {property.bedrooms}</p>
      <p>Bathrooms: {property.bathrooms}</p>
      <p>Available: {property.available ? 'Yes' : 'No'}</p>
      <hr />
      
    </div>
  );
}

export default PropertyCard;