package com.airbnb.clone.property_booking.service;

import java.time.LocalDateTime;

import java.util.List;

import org.springframework.stereotype.Service;

import com.airbnb.clone.Guest.Entity.Guest;
import com.airbnb.clone.Guest.Repository.GuestRepository;
import com.airbnb.clone.property_booking.entity.Booking;
import com.airbnb.clone.property_booking.exception.BookingException;
import com.airbnb.clone.property_booking.repository.BookingRepository;
import com.airbnb.clone.property_listing.repository.Property_Repository;
import com.airbnb.clone.property_booking.dto.BookingRequestDto;
import com.airbnb.clone.property_booking.entity.BookingStatus;
import com.airbnb.clone.property_listing.entity.Property;

@Service
public class BookingServiceImpl implements BookingService {
    private final BookingRepository bookingRepository;

    private final Property_Repository propertyRepository;

    private final GuestRepository guestRepository;

    BookingServiceImpl(BookingRepository bookingRepository, Property_Repository propertyRepository, GuestRepository guestRepository) {
        this.bookingRepository = bookingRepository;
        this.propertyRepository = propertyRepository;
        this.guestRepository = guestRepository;
    }
    
    @Override
    public Booking createBooking(BookingRequestDto bookingDto) {
        Booking booking = new Booking();
        booking.setCheckInDate(bookingDto.getCheckInDate());
        booking.setCheckOutDate(bookingDto.getCheckOutDate());
        booking.setTotalAmount(bookingDto.getTotalAmount());
        booking.setCreatedAt(LocalDateTime.now());
        
        if (bookingDto.getStatus() != null) {
            booking.setStatus(BookingStatus.valueOf(bookingDto.getStatus()));
        } else {
            booking.setStatus(BookingStatus.CONFIRMED);
        }

        if (bookingDto.getPropertyId() != null) {
            Property property = propertyRepository.findById(bookingDto.getPropertyId())
                .orElseThrow(() -> new BookingException("Property not found with id : " + bookingDto.getPropertyId()));
            booking.setProperty(property);
        }

        if (bookingDto.getGuestId() != null) {
            Guest guest = guestRepository.findById(bookingDto.getGuestId())
                .orElseThrow(() -> new BookingException("Guest not found with id : " + bookingDto.getGuestId()));
            booking.setGuest(guest);
        }

        return bookingRepository.save(booking);
    }



    @Override
    public Booking updateBooking(Long bookingId, Booking booking) {

        Booking existingBooking = bookingRepository.findById(bookingId).orElse(null);

        if (existingBooking != null) {

            existingBooking.setCheckInDate(booking.getCheckInDate());
            existingBooking.setCheckOutDate(booking.getCheckOutDate());
            existingBooking.setTotalAmount(booking.getTotalAmount());
            existingBooking.setStatus(booking.getStatus());
            existingBooking.setCreatedAt(booking.getCreatedAt());
            existingBooking.setPrivateNotes(booking.getPrivateNotes());

            return bookingRepository.save(existingBooking);
        }

        return null;
    }

    @Override
    public void deleteBooking(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId).orElse(null);

        if (booking != null) {
            bookingRepository.delete(booking);
        }

    }

    public Booking getBookingById(Long bookingId) {

        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingException(
                        "Booking not found with id : "
                                + bookingId));
    }

    @Override
    public List<Booking> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAll();
        boolean updated = false;
        List<Guest> guests = guestRepository.findAll();
        if (!guests.isEmpty()) {
            Guest defaultGuest = guests.get(0);
            for (Booking booking : bookings) {
                if (booking.getGuest() == null) {
                    booking.setGuest(defaultGuest);
                    bookingRepository.save(booking);
                    updated = true;
                }
            }
        }
        if (updated) {
            return bookingRepository.findAll();
        }
        return bookings;
    }

    @Override
    public List<Booking> getBookingsByUserId(Long userId) {
        return bookingRepository.findByGuestUserId(userId);
    }

    @Override
    public List<Booking> getBookingsByHostId(Long hostId) {
        return bookingRepository.findByPropertyHostId(hostId);
    }
}
