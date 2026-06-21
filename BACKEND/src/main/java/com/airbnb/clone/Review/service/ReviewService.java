package com.airbnb.clone.Review.service;

import java.util.List;

import com.airbnb.clone.Review.dto.ReviewRequestDto;
import com.airbnb.clone.Review.entity.Review;

public interface ReviewService {

    Review createReview(ReviewRequestDto dto);

    List<Review> getReviewsByPropertyId(Long propertyId);

    List<Review> getReviewsByGuestId(Long guestId);

    boolean hasReviewedBooking(Long bookingId);

    /** Returns {rating: Double, count: long} for a property. rating is null if no reviews. */
    java.util.Map<String, Object> getRatingSummary(Long propertyId);
}
