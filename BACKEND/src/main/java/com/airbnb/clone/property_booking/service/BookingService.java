package com.airbnb.clone.property_booking.service;

import java.util.List;

import com.airbnb.clone.property_booking.entity.Booking;

public interface BookingService {

    List<Booking> getAllBookings();

    Booking getBookingById(Long bookingId);

    Booking addBooking(Booking booking);

    Booking updateBooking(Long bookingId, Booking booking);

    Booking deleteBooking(Long bookingId);
}