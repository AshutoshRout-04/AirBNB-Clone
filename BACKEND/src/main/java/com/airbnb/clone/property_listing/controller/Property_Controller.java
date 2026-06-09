package com.airbnb.clone.property_listing.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.airbnb.clone.property_listing.entity.Property;
import com.airbnb.clone.property_listing.service.Property_Service;

@CrossOrigin(origins = "http://localhost:5173")
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
    public ResponseEntity<List<Property>> getAllProperties() {
        return ResponseEntity.ok(propertyService.getAllProperties());
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<Property> getPropertyById(@PathVariable Long id) {
        return ResponseEntity.ok(propertyService.getPropertyById(id));
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateProperty(@PathVariable Long id, @RequestBody Property property) {
        propertyService.updateProperty(id, property);
        return ResponseEntity.ok("Property updated successfully");
    }

    @DeleteMapping("/delete/{id}")
    public String deleteProperty(@PathVariable Long id) {
        return propertyService.deleteProperty(id);
    }

}
