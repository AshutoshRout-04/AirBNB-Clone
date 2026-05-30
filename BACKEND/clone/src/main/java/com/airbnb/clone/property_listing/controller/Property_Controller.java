package com.airbnb.clone.property_listing.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.airbnb.clone.property_listing.entity.Property;
import com.airbnb.clone.property_listing.service.Property_Service;

@RestController
@RequestMapping("/properties")
public class Property_Controller {
    @Autowired
    private Property_Service propertyService;

    @PostMapping("/addProperty")
    public Property addProperty(@RequestBody Property property) {
        return propertyService.addProperty(property);
    }
    
    @GetMapping("/getAll")
    public String getAllProperties() {
        return propertyService.getAllProperties().toString();
    }

    @GetMapping("/getById/{id}")
    public Property getPropertyById(@PathVariable Long id) {
        return propertyService.getPropertyById(id);
    }

}
