package com.airbnb.clone.property_booking.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.airbnb.clone.Guest.Entity.Guest;
import com.airbnb.clone.property_listing.entity.Property;

@Entity
@Table(name = "bookings")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    private LocalDate checkInDate;

    private LocalDate checkOutDate;

    private Double totalAmount;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    private LocalDateTime createdAt;
    
    @ManyToOne
    @JoinColumn(name="Guest_Id")
    private Guest guest;
    
    
    @ManyToOne
    @JoinColumn(name="Property_Id")
    private Property property;
    
    
    
    
}