package com.airbnb.clone.property_listing.service;



import java.util.List;

import org.springframework.http.ResponseEntity;

import com.airbnb.clone.property_listing.entity.Property;


public interface Property_Service {
    
    ResponseEntity<List<Property>> getAllProperties();
    Property getPropertyById(Long id);
    Property addProperty(Property property);
    Property updateProperty(Long id, Property property);
    Property deleteProperty(Long id);
}
