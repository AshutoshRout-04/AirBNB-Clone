package com.airbnb.clone.property_listing.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
    private Long id;

    @NotBlank(message = "Title can't be blank")
    private String title;

    @NotBlank(message = "Description can't be blank")
    private String description;

    @NotBlank(message = "Location can't be blank")
    private String location;

    @Positive(message = "Price per night must be positive")
    private float pricePerNight;

    @Positive(message = "Max guests must be positive")
    private int maxGuests;

    @Positive(message = "Bedrooms must be positive")
    private int bedrooms;

    @Positive(message = "Bathrooms must be positive")
    private int bathrooms;

    private boolean available;
}
