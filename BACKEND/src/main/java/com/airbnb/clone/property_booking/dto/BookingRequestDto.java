package com.airbnb.clone.property_booking.dto;

import java.time.LocalDate;
import lombok.Data;

@Data
public class BookingRequestDto {
    private Long guestId;
    private Long propertyId;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Float totalAmount;
    private String status;
}
