package com.airbnb.clone.Admin.Controller;


import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.airbnb.clone.Guest.Entity.Guest;
import com.airbnb.clone.Guest.Service.GuestService;
import com.airbnb.clone.Host.Entity.Host;
import com.airbnb.clone.Host.Service.HostService;
import com.airbnb.clone.property_booking.entity.Booking;
import com.airbnb.clone.property_booking.service.BookingService;
import com.airbnb.clone.property_listing.entity.Property;
import com.airbnb.clone.property_listing.service.Property_Service;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final GuestService guestService;
    private final HostService hostService;
    private final Property_Service propertyService;
    private final BookingService bookingService;

  
    @GetMapping("/guests")
    public ResponseEntity<List<Guest>> getAllGuests() {
        return ResponseEntity.ok(guestService.getAllGuests());
    }

    @DeleteMapping("/guests/{id}")
    public ResponseEntity<String> deleteGuest(
            @PathVariable Long id) {

        guestService.deleteGuest(id);

        return ResponseEntity.ok(
                "Guest deleted successfully");
    }



    @GetMapping("/hosts")
    public ResponseEntity<List<Host>> getAllHosts() {
        return ResponseEntity.ok(hostService.getAllHosts());
    }

    @DeleteMapping("/hosts/{id}")
    public ResponseEntity<String> deleteHost(
            @PathVariable Long id) {

        hostService.deleteHost(id);

        return ResponseEntity.ok(
                "Host deleted successfully");
    }

  

    @GetMapping("/properties")
    public ResponseEntity<List<Property>> getAllProperties() {

        return ResponseEntity.ok(
                propertyService.getAllProperties());
    }

    @DeleteMapping("/properties/{id}")
    public ResponseEntity<String> deleteProperty(
            @PathVariable Long id) {

        propertyService.deleteProperty(id);

        return ResponseEntity.ok(
                "Property deleted successfully");
    }

  

    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {

        return ResponseEntity.ok(
                bookingService.getAllBookings());
    }

    @DeleteMapping("/bookings/{id}")
    public ResponseEntity<String> deleteBooking(
            @PathVariable Long id) {

        bookingService.deleteBooking(id);

        return ResponseEntity.ok(
                "Booking deleted successfully");
    }
}