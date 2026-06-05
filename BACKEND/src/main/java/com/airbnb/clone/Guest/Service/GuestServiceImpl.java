package com.airbnb.clone.Guest.Service;



import java.util.List;

import org.springframework.stereotype.Service;

import com.airbnb.clone.Guest.Entity.Guest;
import com.airbnb.clone.Guest.Repository.GuestRepository;
import com.airbnb.clone.Guest.Service.GuestService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GuestServiceImpl implements GuestService {

    private final GuestRepository guestRepository;

    @Override
    public Guest createGuest(Guest guest) {
    	
    	if(guestRepository.findById(guest.getId())!=null) {
    		 throw new RuntimeException("Guest is already present");
    	}
        return guestRepository.save(guest);
    }

    @Override
    public Guest getGuestById(Long id) {
        return guestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Guest Not Found"));
    }

    @Override
    public List<Guest> getAllGuests() {
        return guestRepository.findAll();
    }

    @Override
    public Guest updateGuest(Long id, Guest updatedGuest) {

        Guest guest = guestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Guest Not Found"));

  
        guest.setDateOfBirth(updatedGuest.getDateOfBirth());
        guest.setProfileImage(updatedGuest.getProfileImage());
        guest.setTotalBookings(updatedGuest.getTotalBookings());
        guest.setAverageRating(updatedGuest.getAverageRating());

        return guestRepository.save(guest);
    }

    @Override
    public void deleteGuest(Long id) {

        Guest guest = guestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Guest Not Found"));

        guestRepository.delete(guest);
    }
}
