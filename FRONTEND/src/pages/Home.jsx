import { useEffect, useState } from "react";
import PropertyCard from "../components/PropertyCard";
import Header from "../components/Header";
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
    <>
      <Header />

      <div className="container">
        <div className="property-grid">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
