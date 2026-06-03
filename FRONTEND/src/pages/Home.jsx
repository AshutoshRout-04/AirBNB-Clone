import { useEffect, useState } from "react";
import PropertyCard from "../components/PropertyCard";
import { getAllProperties } from "../services/PropertyService";

function Home() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    getAllProperties()
      .then((response) => {
        setProperties(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <h1>Property Listings</h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}

export default Home;
