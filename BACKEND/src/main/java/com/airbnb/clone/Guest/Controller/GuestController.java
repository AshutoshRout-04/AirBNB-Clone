package com.airbnb.clone.Guest.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.airbnb.clone.Guest.Entity.Guest;
import com.airbnb.clone.Guest.Service.GuestService;

import lombok.RequiredArgsConstructor;

@CrossOrigin
@RestController
@RequestMapping("/api/Guest")
@RequiredArgsConstructor
public class GuestController {

    private final GuestService guestService;

    @PostMapping("/add")
    public ResponseEntity<Guest> createGuest(@RequestBody Guest guest) {

        if (guest == null) {
            throw new RuntimeException("Guest data cannot be null");
        }

        Guest savedGuest = guestService.createGuest(guest);

        return new ResponseEntity<>(savedGuest, HttpStatus.CREATED);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Guest> getGuestById(@PathVariable Long id) {

        if (id == null) {
            throw new RuntimeException("Guest Id is required");
        }

        Guest guest = guestService.getGuestById(id);

        return ResponseEntity.ok(guest);
    }

    @GetMapping("/getall")
    public ResponseEntity<List<Guest>> getAllGuests() {

        List<Guest> guests = guestService.getAllGuests();

        if (guests.isEmpty()) {
            throw new RuntimeException("No Guests Found");
        }

        return ResponseEntity.ok(guests);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Guest> updateGuest(
            @PathVariable Long id,
            @RequestBody Guest guest) {

        if (id == null) {
            throw new RuntimeException("Guest Id is required");
        }

        if (guest == null) {
            throw new RuntimeException("Guest data cannot be null");
        }

        Guest updatedGuest = guestService.updateGuest(id, guest);

        return ResponseEntity.ok(updatedGuest);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteGuest(@PathVariable Long id) {

        if (id == null) {
            throw new RuntimeException("Guest Id is required");
        }

        guestService.deleteGuest(id);

        return ResponseEntity.ok("Guest deleted successfully");
    }
}