package com.airbnb.clone.property_booking.service;

import java.util.List;

import com.airbnb.clone.property_booking.entity.Booking;

import com.airbnb.clone.property_booking.dto.BookingRequestDto;

public interface BookingService {

    Booking createBooking(BookingRequestDto bookingDto);

    Booking getBookingById(Long bookingId);

    List<Booking> getAllBookings();

    Booking updateBooking(Long bookingId, Booking updatedBooking);

    void deleteBooking(Long bookingId);
}