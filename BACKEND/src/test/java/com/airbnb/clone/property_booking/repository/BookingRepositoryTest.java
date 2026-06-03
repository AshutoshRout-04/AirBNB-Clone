package com.airbnb.clone.property_booking.repository;

import com.airbnb.clone.property_booking.entity.Booking;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.*;

@DataJpaTest
@DisplayName("BookingRepository Tests")
class BookingRepositoryTest {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private TestEntityManager testEntityManager;

    private Booking booking1;
    private Booking booking2;
    private Booking booking3;

    @BeforeEach
    void setUp() {
        // Create test bookings
        booking1 = new Booking();
        booking1.setPropertyId(1L);
        booking1.setUserId(10L);
        booking1.setCheckInDate(LocalDate.of(2026, 6, 5));
        booking1.setCheckOutDate(LocalDate.of(2026, 6, 10));
        booking1.setTotalPrice(500.0);
        booking1.setStatus("CONFIRMED");
        booking1.setCreatedAt(LocalDateTime.now());

        booking2 = new Booking();
        booking2.setPropertyId(2L);
        booking2.setUserId(10L);
        booking2.setCheckInDate(LocalDate.of(2026, 7, 1));
        booking2.setCheckOutDate(LocalDate.of(2026, 7, 5));
        booking2.setTotalPrice(400.0);
        booking2.setStatus("PENDING");
        booking2.setCreatedAt(LocalDateTime.now());

        booking3 = new Booking();
        booking3.setPropertyId(1L);
        booking3.setUserId(20L);
        booking3.setCheckInDate(LocalDate.of(2026, 8, 1));
        booking3.setCheckOutDate(LocalDate.of(2026, 8, 7));
        booking3.setTotalPrice(600.0);
        booking3.setStatus("CONFIRMED");
        booking3.setCreatedAt(LocalDateTime.now());

        // Persist bookings to the database
        testEntityManager.persist(booking1);
        testEntityManager.persist(booking2);
        testEntityManager.persist(booking3);
        testEntityManager.flush();
    }

    @Test
    @DisplayName("Should save a booking successfully")
    void testSaveBooking() {
        Booking newBooking = new Booking();
        newBooking.setPropertyId(3L);
        newBooking.setUserId(30L);
        newBooking.setCheckInDate(LocalDate.of(2026, 9, 1));
        newBooking.setCheckOutDate(LocalDate.of(2026, 9, 5));
        newBooking.setTotalPrice(550.0);
        newBooking.setStatus("CONFIRMED");
        newBooking.setCreatedAt(LocalDateTime.now());

        Booking savedBooking = bookingRepository.save(newBooking);

        assertThat(savedBooking).isNotNull();
        assertThat(savedBooking.getBookingId()).isNotNull();
        assertThat(savedBooking.getUserId()).isEqualTo(30L);
        assertThat(savedBooking.getPropertyId()).isEqualTo(3L);
    }

    @Test
    @DisplayName("Should find all bookings by user ID")
    void testFindByUserId() {
        List<Booking> userBookings = bookingRepository.findByUserId(10L);

        assertThat(userBookings).isNotNull();
        assertThat(userBookings).hasSize(2);
        assertThat(userBookings).extracting(Booking::getUserId)
                .allMatch(userId -> userId.equals(10L));
    }

    @Test
    @DisplayName("Should return empty list when user has no bookings")
    void testFindByUserId_NoBookings() {
        List<Booking> userBookings = bookingRepository.findByUserId(999L);

        assertThat(userBookings).isNotNull();
        assertThat(userBookings).isEmpty();
    }

    @Test
    @DisplayName("Should find all bookings by property ID")
    void testFindByPropertyId() {
        List<Booking> propertyBookings = bookingRepository.findByPropertyId(1L);

        assertThat(propertyBookings).isNotNull();
        assertThat(propertyBookings).hasSize(2);
        assertThat(propertyBookings).extracting(Booking::getPropertyId)
                .allMatch(propertyId -> propertyId.equals(1L));
    }

    @Test
    @DisplayName("Should return empty list when property has no bookings")
    void testFindByPropertyId_NoBookings() {
        List<Booking> propertyBookings = bookingRepository.findByPropertyId(999L);

        assertThat(propertyBookings).isNotNull();
        assertThat(propertyBookings).isEmpty();
    }

    @Test
    @DisplayName("Should find booking by ID")
    void testFindById() {
        List<Booking> allBookings = bookingRepository.findAll();
        Long bookingId = allBookings.get(0).getBookingId();

        var foundBooking = bookingRepository.findById(bookingId);

        assertThat(foundBooking).isPresent();
        assertThat(foundBooking.get().getBookingId()).isEqualTo(bookingId);
    }

    @Test
    @DisplayName("Should update booking successfully")
    void testUpdateBooking() {
        List<Booking> allBookings = bookingRepository.findAll();
        Booking bookingToUpdate = allBookings.get(0);

        bookingToUpdate.setStatus("CANCELLED");
        bookingToUpdate.setTotalPrice(0.0);
        bookingRepository.save(bookingToUpdate);

        Booking updatedBooking = bookingRepository.findById(bookingToUpdate.getBookingId()).get();
        assertThat(updatedBooking.getStatus()).isEqualTo("CANCELLED");
        assertThat(updatedBooking.getTotalPrice()).isEqualTo(0.0);
    }

    @Test
    @DisplayName("Should delete booking successfully")
    void testDeleteBooking() {
        List<Booking> allBookings = bookingRepository.findAll();
        Booking bookingToDelete = allBookings.get(0);
        Long bookingId = bookingToDelete.getBookingId();

        bookingRepository.deleteById(bookingId);

        var deletedBooking = bookingRepository.findById(bookingId);
        assertThat(deletedBooking).isEmpty();
    }

    @Test
    @DisplayName("Should find all bookings")
    void testFindAll() {
        List<Booking> allBookings = bookingRepository.findAll();

        assertThat(allBookings).isNotNull();
        assertThat(allBookings).hasSize(3);
    }
}
