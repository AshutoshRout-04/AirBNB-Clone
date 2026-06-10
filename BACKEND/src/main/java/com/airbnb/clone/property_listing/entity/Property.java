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

    @Positive(message = "Max guests must be positive")
    private int maxGuests;

    @Positive(message = "No of Bedrooms must be positive")
    private int bedrooms;

    @Positive(message = "No of Bathrooms must be positive")
    private int bathrooms;

    private boolean available;
    
    
    //Dibya thinks you should add a PropertyType field here to help with frontend styling
    
    
    
    // Added Property mapping
    @OneToMany(mappedBy="property")
    private List<Booking> Bookings;
    
    
    
}
