package com.airbnb.clone.property_listing.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airbnb.clone.property_listing.entity.Property;

public interface Property_Repository extends JpaRepository<Property, Long> {

    @org.springframework.data.jpa.repository.Query("SELECT p FROM Property p WHERE p.Host_Id.id = :hostId")
    List<Property> findByHostId(@org.springframework.data.repository.query.Param("hostId") Long hostId);

    List<Property> findByPropertyType(String propertyType);
}
