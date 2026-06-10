import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Home from "../pages/Home/Home";
import PropertyDetails from "../pages/PropertyDetails/PropertyDetails";

const AppRoutes = () => {
  return (
    <Router>
      <div 
        style={{ 
          display: "flex", 
          flexDirection: "column", 
          minHeight: "100vh" 
        }}
      >
        {/* Sticky Navbar */}
        <Navbar />

        {/* Dynamic Route Content */}
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
          </Routes>
        </div>

        {/* Global Footer */}
        <Footer />
      </div>
    </Router>
  );
};

export default AppRoutes;
