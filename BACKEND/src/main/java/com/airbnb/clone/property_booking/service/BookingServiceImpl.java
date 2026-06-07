package com.airbnb.clone.property_booking.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.airbnb.clone.property_booking.entity.Booking;
import com.airbnb.clone.property_booking.repository.BookingRepository;

@Service
public class BookingServiceImpl implements BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Override
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Override
    public Booking getBookingById(Long bookingId) {
        return bookingRepository.findById(bookingId).orElse(null);
    }

    @Override
    public Booking addBooking(Booking booking) {
        return bookingRepository.save(booking);
    }

    @Override
    public Booking updateBooking(Long bookingId, Booking booking) {

        Booking existingBooking = bookingRepository.findById(bookingId).orElse(null);

        if (existingBooking != null) {

            existingBooking.setPropertyId(booking.getPropertyId());
            existingBooking.setUserId(booking.getUserId());
            existingBooking.setCheckInDate(booking.getCheckInDate());
            existingBooking.setCheckOutDate(booking.getCheckOutDate());
            existingBooking.setTotalPrice(booking.getTotalPrice());
            existingBooking.setStatus(booking.getStatus());
            existingBooking.setCreatedAt(booking.getCreatedAt());

            return bookingRepository.save(existingBooking);
        }

        return null;
    }

    @Override
    public Booking deleteBooking(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId).orElse(null);

        if (booking != null) {
            bookingRepository.delete(booking);
        }

        return booking;
    }
}
