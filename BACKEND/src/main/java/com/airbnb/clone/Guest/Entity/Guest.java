package com.airbnb.clone.Guest.Entity;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.Id;

import com.airbnb.clone.User.Entity.User;
import com.airbnb.clone.property_booking.entity.Booking;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Guest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

  

    private LocalDate dateOfBirth;

    private String profileImage;

    private Integer totalBookings;

    private Double averageRating;

   @OneToOne
   @JoinColumn(name="User_Id")
   private User user;
   
   @OneToMany(mappedBy="guest")
   @com.fasterxml.jackson.annotation.JsonIgnore
   private List<Booking> bookings;
   
}
