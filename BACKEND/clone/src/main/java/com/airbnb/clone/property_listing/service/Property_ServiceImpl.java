package com.airbnb.clone.property_listing.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.airbnb.clone.property_listing.entity.Property;
import com.airbnb.clone.property_listing.repository.Property_Repository;

@Service
public class Property_ServiceImpl implements Property_Service {
    @Autowired
    private Property_Repository propertyRepository;
    
    @Override
    public Property addProperty(Property property) {
        return propertyRepository.save(property);
    }
    
    @Override
    public Property getPropertyById(Long id) {
        return propertyRepository.findById(id).orElse(null);
    }
    
    @Override
    public ResponseEntity<List<Property>> getAllProperties() {
        return ResponseEntity.ok(propertyRepository.findAll());
    }
    
    @Override
    public Property updateProperty(Long id, Property property) {
        property.setId(id);
        return propertyRepository.save(property);
    }
    
    @Override
    public Property deleteProperty(Long id) {
        Property property = propertyRepository.findById(id).orElse(null);
        if (property != null) {
            propertyRepository.deleteById(id);
        }
        return property;
    }
}
