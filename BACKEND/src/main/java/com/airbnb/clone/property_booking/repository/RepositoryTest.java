package com.airbnb.clone.property_booking.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class RepositoryTest implements CommandLineRunner {

    @Autowired
    private BookingRepository bookingRepository;

    @Override
    public void run(String... args) {

        System.out.println("================================");
        System.out.println("Booking Repository Loaded");
        System.out.println("Total Records : " + bookingRepository.count());
        System.out.println("================================");

    }
}