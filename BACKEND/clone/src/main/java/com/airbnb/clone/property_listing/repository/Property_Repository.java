package com.airbnb.clone.property_listing.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airbnb.clone.property_listing.entity.Property;

public interface Property_Repository extends JpaRepository<Property, Long> {
    
}
