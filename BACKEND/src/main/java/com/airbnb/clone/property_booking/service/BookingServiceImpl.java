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
import com.airbnb.clone.User.Entity.User;
import com.airbnb.clone.User.repository.UserRepository;

@Service
public class BookingServiceImpl implements BookingService {
    private final BookingRepository bookingRepository;
    private final Property_Repository propertyRepository;
    private final GuestRepository guestRepository;
    private final UserRepository userRepository;

    BookingServiceImpl(BookingRepository bookingRepository, Property_Repository propertyRepository, GuestRepository guestRepository, UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.propertyRepository = propertyRepository;
        this.guestRepository = guestRepository;
        this.userRepository = userRepository;
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

        // Persist payment info
        if (bookingDto.getPaymentMethod() != null) {
            booking.setPaymentMethod(bookingDto.getPaymentMethod());
        }
        if (bookingDto.getPaymentStatus() != null) {
            booking.setPaymentStatus(bookingDto.getPaymentStatus());
        } else {
            booking.setPaymentStatus("PAID");
        }

        if (bookingDto.getPropertyId() != null) {
            Property property = propertyRepository.findById(bookingDto.getPropertyId())
                .orElseThrow(() -> new BookingException("Property not found with id : " + bookingDto.getPropertyId()));
            booking.setProperty(property);
        }

        Guest resolvedGuest = null;

        // Try using guestId first
        if (bookingDto.getGuestId() != null) {
            resolvedGuest = guestRepository.findById(bookingDto.getGuestId()).orElse(null);
        }

        // Fallback to userId if guest profile is not found or null
        if (resolvedGuest == null && bookingDto.getUserId() != null) {
            final Long uid = bookingDto.getUserId();
            resolvedGuest = guestRepository.findAll().stream()
                .filter(g -> g.getUser() != null && g.getUser().getId().equals(uid))
                .findFirst()
                .orElse(null);

            // If still no Guest record exists for this User (e.g. host/admin making booking), create one on the fly!
            if (resolvedGuest == null) {
                User user = userRepository.findById(uid)
                    .orElseThrow(() -> new BookingException("User not found with id : " + uid));
                Guest guest = new Guest();
                guest.setUser(user);
                guest.setTotalBookings(1);
                guest.setAverageRating(0.0);
                resolvedGuest = guestRepository.save(guest);
            }
        }

        if (resolvedGuest != null) {
            booking.setGuest(resolvedGuest);
        } else {
            throw new BookingException("Unable to resolve guest profile for this booking request.");
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
    public Booking updateBookingStatus(Long bookingId, String status) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new BookingException("Booking not found with id: " + bookingId));
        booking.setStatus(BookingStatus.valueOf(status.toUpperCase()));
        return bookingRepository.save(booking);
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
