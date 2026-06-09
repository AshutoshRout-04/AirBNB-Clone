package com.airbnb.clone.Guest.Repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.airbnb.clone.Guest.Entity.Guest;

public interface GuestRepository extends JpaRepository<Guest, Long> {

}
