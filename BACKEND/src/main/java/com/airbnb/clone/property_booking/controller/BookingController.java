package com.airbnb.clone.property_booking.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.airbnb.clone.property_booking.entity.Booking;
import com.airbnb.clone.property_booking.service.BookingService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/addBooking")
    public ResponseEntity<String> addBooking(@RequestBody Booking booking) {

        bookingService.createBooking(booking);

        return ResponseEntity.ok("Booking created successfully");
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<Booking>> getAllBookings() {

        return ResponseEntity.ok(
                bookingService.getAllBookings()
        );
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<Booking> getBookingById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                bookingService.getBookingById(id)
        );
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateBooking(
            @PathVariable Long id,
            @RequestBody Booking booking) {

        bookingService.updateBooking(id, booking);

        return ResponseEntity.ok(
                "Booking updated successfully"
        );
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteBooking(
            @PathVariable Long id) {

        bookingService.deleteBooking(id);

        return ResponseEntity.ok(
                "Booking deleted successfully"
        );
    }
}