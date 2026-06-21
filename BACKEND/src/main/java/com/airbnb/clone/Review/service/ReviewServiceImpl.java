package com.airbnb.clone.Review.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.airbnb.clone.Guest.Entity.Guest;
import com.airbnb.clone.Guest.Repository.GuestRepository;
import com.airbnb.clone.Review.dto.ReviewRequestDto;
import com.airbnb.clone.Review.entity.Review;
import com.airbnb.clone.Review.repository.ReviewRepository;
import com.airbnb.clone.property_booking.entity.Booking;
import com.airbnb.clone.property_booking.repository.BookingRepository;
import com.airbnb.clone.property_listing.entity.Property;
import com.airbnb.clone.property_listing.repository.Property_Repository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final Property_Repository propertyRepository;
    private final GuestRepository guestRepository;
    private final BookingRepository bookingRepository;

    @Override
    public Review createReview(ReviewRequestDto dto) {
        Property property = propertyRepository.findById(dto.getPropertyId())
            .orElseThrow(() -> new RuntimeException("Property not found: " + dto.getPropertyId()));

        Guest guest = guestRepository.findById(dto.getGuestId())
            .orElseThrow(() -> new RuntimeException("Guest not found: " + dto.getGuestId()));

        Booking booking = bookingRepository.findById(dto.getBookingId())
            .orElseThrow(() -> new RuntimeException("Booking not found: " + dto.getBookingId()));

        Review review = new Review();
        review.setProperty(property);
        review.setGuest(guest);
        review.setBooking(booking);
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());
        review.setCreatedAt(LocalDateTime.now());

        return reviewRepository.save(review);
    }

    @Override
    public List<Review> getReviewsByPropertyId(Long propertyId) {
        return reviewRepository.findByPropertyId(propertyId);
    }

    @Override
    public List<Review> getReviewsByGuestId(Long guestId) {
        return reviewRepository.findByGuestId(guestId);
    }

    @Override
    public boolean hasReviewedBooking(Long bookingId) {
        return reviewRepository.existsByBookingBookingId(bookingId);
    }

    @Override
    public java.util.Map<String, Object> getRatingSummary(Long propertyId) {
        long count = reviewRepository.countByPropertyId(propertyId);
        Double avg = reviewRepository.avgRatingByPropertyId(propertyId);
        java.util.Map<String, Object> result = new java.util.HashMap<>();
        result.put("count", count);
        result.put("rating", count > 0 && avg != null ? Math.round(avg * 10.0) / 10.0 : null);
        return result;
    }
}
