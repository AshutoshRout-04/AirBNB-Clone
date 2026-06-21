package com.airbnb.clone.Review.dto;

import lombok.Data;

@Data
public class ReviewRequestDto {
    private Long propertyId;
    private Long guestId;
    private Long bookingId;
    private Integer rating;
    private String comment;
}
