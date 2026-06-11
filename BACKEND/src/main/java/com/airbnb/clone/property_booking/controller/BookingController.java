package com.airbnb.clone.property_booking.controller;

import java.util.List;
import org.springframework.http.HttpStatus;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.airbnb.clone.property_booking.entity.Booking;
import com.airbnb.clone.property_booking.service.BookingService;

import lombok.RequiredArgsConstructor;

import com.airbnb.clone.property_booking.dto.BookingRequestDto;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/v1/bookings") // Keep the original mapping the frontend uses
@RequiredArgsConstructor
public class BookingController {
        @Autowired
        private BookingService bookingService;

        @PostMapping
        public ResponseEntity<Booking> createBooking(@RequestBody BookingRequestDto bookingDto) {
                return new ResponseEntity<>(bookingService.createBooking(bookingDto),HttpStatus.CREATED);
        }

        @GetMapping("/{bookingId}")
        public ResponseEntity<Booking> getBookingById(
                        @PathVariable Long bookingId) {

                return ResponseEntity.ok(
                                bookingService.getBookingById(
                                                bookingId));
        }

        @GetMapping
        public ResponseEntity<List<Booking>> getAllBookings() {

                return ResponseEntity.ok(
                                bookingService.getAllBookings());
        }

        @PutMapping("/{bookingId}")
        public ResponseEntity<Booking> updateBooking(
                        @PathVariable Long bookingId,
                        @RequestBody Booking booking) {

                return ResponseEntity.ok(
                                bookingService.updateBooking(
                                                bookingId,
                                                booking));
        }

        @DeleteMapping("/{bookingId}")
        public ResponseEntity<String> deleteBooking(
                        @PathVariable Long bookingId) {

                bookingService.deleteBooking(bookingId);

                return ResponseEntity.ok(
                                "Booking deleted successfully");
        }
}