package com.airbnb.clone.property_booking.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airbnb.clone.property_booking.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {

}