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
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.airbnb.clone.property_booking.entity.Booking;
import com.airbnb.clone.property_booking.exception.BookingException;
import com.airbnb.clone.property_booking.repository.BookingRepository;
import com.airbnb.clone.property_booking.service.BookingService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;

    @Override
    public Booking createBooking(Booking booking) {

        booking.setCreatedAt(LocalDateTime.now());

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
    public Booking getBookingById(Long bookingId) {

        return bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new BookingException(
                                "Booking not found with id : "
                                        + bookingId));
    }

    @Override
    public List<Booking> getAllBookings() {

        return bookingRepository.findAll();
    }

    @Override
    public Booking updateBooking(
            Long bookingId,
            Booking updatedBooking) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new BookingException(
                                "Booking not found with id : "
                                        + bookingId));

        booking.setCheckInDate(
                updatedBooking.getCheckInDate());

        booking.setCheckOutDate(
                updatedBooking.getCheckOutDate());

        booking.setTotalAmount(
                updatedBooking.getTotalAmount());

        booking.setStatus(
                updatedBooking.getStatus());

        return bookingRepository.save(booking);
    }

    @Override
    public void deleteBooking(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new BookingException(
                                "Booking not found with id : "
                                        + bookingId));

        bookingRepository.delete(booking);
    }
}
