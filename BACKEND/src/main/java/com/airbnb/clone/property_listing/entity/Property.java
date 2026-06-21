package com.airbnb.clone.property_listing.entity;


import java.util.List;

import com.airbnb.clone.Host.Entity.Host;
import com.airbnb.clone.property_booking.entity.Booking;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Property {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name ="property_id")
    private Long id;

    @NotBlank(message = "Title can't be blank")
    private String title;
    
    // Host is mapped
    @ManyToOne
    private Host Host_Id;
    
    

    @NotBlank(message = "Description can't be blank")
    private String description;

    @NotBlank(message = "Location can't be blank")
    private String location;

    @Column(name = "price_per_night")
    @Positive(message = "Price per night must be positive")
    private float pricePerNight;

    @Min(value = 1, message = "Max guests must be at least 1")
    private int maxGuests;

    @Min(value = 0, message = "No of Bedrooms can't be negative")
    private int bedrooms;

    @Min(value = 0, message = "No of Bathrooms can't be negative")
    private int bathrooms;

    private boolean available;

    @Column(columnDefinition = "TEXT")
    private String amenities;

    @Column(columnDefinition = "LONGTEXT")
    private String photos;

    private String wifiNetwork;
    private String wifiPassword;
    private String checkInMethod;

    @Column(columnDefinition = "TEXT")
    private String checkInInstructions;

    @Column(columnDefinition = "TEXT")
    private String houseRules;

    //Dibya thinks you should add a PropertyType field here to help with frontend styling
    private String propertyType;
    private String companyName;
    
    
    // Added Property mapping
    @OneToMany(mappedBy="property")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<Booking> Bookings;
    
    
    
}
