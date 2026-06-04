package com.airbnb.clone.Guest.Service;

import java.util.List;

import com.airbnb.clone.Guest.Entity.Guest;

public interface GuestService {

    Guest createGuest(Guest guest);

    Guest getGuestById(Long id);

    List<Guest> getAllGuests();

    Guest updateGuest(Long id, Guest updatedGuest);

    void deleteGuest(Long id);
}