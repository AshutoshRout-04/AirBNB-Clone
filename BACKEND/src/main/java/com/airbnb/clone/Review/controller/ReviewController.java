package com.airbnb.clone.Review.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.airbnb.clone.Review.dto.ReviewRequestDto;
import com.airbnb.clone.Review.entity.Review;
import com.airbnb.clone.Review.service.ReviewService;

import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody ReviewRequestDto dto) {
        return new ResponseEntity<>(reviewService.createReview(dto), HttpStatus.CREATED);
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<Review>> getReviewsByProperty(@PathVariable Long propertyId) {
        return ResponseEntity.ok(reviewService.getReviewsByPropertyId(propertyId));
    }

    @GetMapping("/guest/{guestId}")
    public ResponseEntity<List<Review>> getReviewsByGuest(@PathVariable Long guestId) {
        return ResponseEntity.ok(reviewService.getReviewsByGuestId(guestId));
    }

    @GetMapping("/booking/{bookingId}/exists")
    public ResponseEntity<Map<String, Boolean>> checkReviewExists(@PathVariable Long bookingId) {
        boolean exists = reviewService.hasReviewedBooking(bookingId);
        return ResponseEntity.ok(Map.of("reviewed", exists));
    }

    @GetMapping("/summary/{propertyId}")
    public ResponseEntity<Map<String, Object>> getRatingSummary(@PathVariable Long propertyId) {
        return ResponseEntity.ok(reviewService.getRatingSummary(propertyId));
    }
}
