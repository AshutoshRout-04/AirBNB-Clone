package com.airbnb.clone.property_booking.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airbnb.clone.property_booking.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Find all bookings for a guest by their associated user ID
    List<Booking> findByGuestUserId(Long userId);

    @org.springframework.data.jpa.repository.Query("SELECT b FROM Booking b WHERE b.property.Host_Id.id = :hostId")
    List<Booking> findByPropertyHostId(@org.springframework.data.repository.query.Param("hostId") Long hostId);
}