package com.airbnb.clone.property_listing.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.airbnb.clone.property_listing.entity.Property;
import com.airbnb.clone.property_listing.exception.PropertyNotFoundException;
import com.airbnb.clone.property_listing.repository.Property_Repository;

@Service
public class Property_ServiceImpl implements Property_Service {
    @Autowired
    private Property_Repository propertyRepository;
      
    @Override
    public Property addProperty(Property property) {
        System.out.println("Property Added Sucessfully");
        return propertyRepository.save(property);
    }
    
    @Override
    public Property getPropertyById(Long id) {
        return propertyRepository.findById(id).orElseThrow(() -> new PropertyNotFoundException("Property Not Found: " + id));
    }
    
    @Override
    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }
    
    @Override
public Property updateProperty(Long id, Property property) {

    Property existingProperty =propertyRepository.findById(id).orElseThrow(() ->new PropertyNotFoundException("Property not found with id: " +id));

    existingProperty.setTitle(property.getTitle());
    existingProperty.setDescription(property.getDescription());
    existingProperty.setLocation(property.getLocation());
    existingProperty.setPricePerNight(property.getPricePerNight());
    existingProperty.setMaxGuests(property.getMaxGuests());
    existingProperty.setBedrooms(property.getBedrooms());
    existingProperty.setBathrooms(property.getBathrooms());
    existingProperty.setAvailable(property.isAvailable());
    
    // Copy the extended host features fields
    existingProperty.setAmenities(property.getAmenities());
    existingProperty.setPhotos(property.getPhotos());
    existingProperty.setWifiNetwork(property.getWifiNetwork());
    existingProperty.setWifiPassword(property.getWifiPassword());
    existingProperty.setCheckInMethod(property.getCheckInMethod());
    existingProperty.setCheckInInstructions(property.getCheckInInstructions());
    existingProperty.setHouseRules(property.getHouseRules());
    existingProperty.setPropertyType(property.getPropertyType());
    existingProperty.setCompanyName(property.getCompanyName());

    return propertyRepository.save(existingProperty);
}
    
    @Override
    public List<Property> getPropertiesByHostId(Long hostId) {
        return propertyRepository.findByHostId(hostId);
    }

    @Override
    public List<Property> getPropertiesByType(String propertyType) {
        return propertyRepository.findByPropertyType(propertyType);
    }

    @Override
    public String deleteProperty(Long id) {
        propertyRepository.deleteById(id);
        return "Property deleted successfully";
    }
}
