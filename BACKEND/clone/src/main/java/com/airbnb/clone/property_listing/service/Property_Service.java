package com.airbnb.clone.property_listing.service;



import java.util.List;



import com.airbnb.clone.property_listing.entity.Property;


public interface Property_Service {
    
    List<Property> getAllProperties();
    Property getPropertyById(Long id);
    Property addProperty(Property property);
    Property updateProperty(Long id, Property property);
    Property deleteProperty(Long id);
}
