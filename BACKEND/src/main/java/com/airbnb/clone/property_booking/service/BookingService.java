package com.airbnb.clone.property_booking.service;

import java.util.List;

import com.airbnb.clone.property_booking.entity.Booking;

public interface BookingService {

    Booking createBooking(Booking booking);

    Booking getBookingById(Long bookingId);

    List<Booking> getAllBookings();

    Booking updateBooking(Long bookingId, Booking updatedBooking);

    void deleteBooking(Long bookingId);
}