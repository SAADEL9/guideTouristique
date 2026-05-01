package com.saad.guideTouristique.controllers;

import com.saad.guideTouristique.models.*;
import com.saad.guideTouristique.security.services.UserDetailsImpl;
import com.saad.guideTouristique.services.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    ReviewService reviewService;

    // PUBLIC — Approved reviews for an establishment
    @GetMapping
    public List<Review> getReviews(
            @RequestParam String establishmentId,
            @RequestParam(required = false) EEstablishmentType establishmentType) {
        return reviewService.getApprovedReviews(establishmentId, establishmentType);
    }

    // PUBLIC — Single review
    @GetMapping("/{id}")
    public ResponseEntity<?> getReview(@PathVariable String id) {
        try {
            return ResponseEntity.ok(reviewService.getReviewById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ADMIN — All reviews
    @GetMapping("/all")
    public List<Review> getAllReviews() {
        return reviewService.getAllReviews();
    }

    // ADMIN — Flagged reviews
    @GetMapping("/flagged")
    public List<Review> getFlaggedReviews() {
        return reviewService.getFlaggedReviews();
    }

    // AUTHENTICATED — Own reviews
    @GetMapping("/my")
    public List<Review> getMyReviews(@AuthenticationPrincipal UserDetailsImpl user) {
        return reviewService.getMyReviews(user.getId());
    }

    // AUTHENTICATED — Create review
    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody Review review,
                                          @AuthenticationPrincipal UserDetailsImpl user) {
        if (user == null) return ResponseEntity.status(401).body("Not authenticated");
        try {
            return ResponseEntity.ok(reviewService.createReview(review, user.getId(), user.getUsername()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ADMIN — Approve or reject a review
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String id,
                                          @RequestParam EReviewStatus status,
                                          @AuthenticationPrincipal UserDetailsImpl user) {
        if (user == null) return ResponseEntity.status(401).body("Not authenticated");
        try {
            return ResponseEntity.ok(reviewService.updateStatus(id, status));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // BUSINESS — Reply to a review as the establishment owner
    @PutMapping("/{id}/owner-reply")
    public ResponseEntity<?> addOwnerReply(@PathVariable String id,
                                            @RequestParam String reply,
                                            @AuthenticationPrincipal UserDetailsImpl user) {
        if (user == null) return ResponseEntity.status(401).body("Not authenticated");
        try {
            return ResponseEntity.ok(reviewService.addOwnerReply(id, reply));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // AUTHENTICATED — Toggle helpful vote
    @PutMapping("/{id}/helpful")
    public ResponseEntity<?> voteHelpful(@PathVariable String id,
                                          @AuthenticationPrincipal UserDetailsImpl user) {
        if (user == null) return ResponseEntity.status(401).body("Not authenticated");
        return ResponseEntity.ok(reviewService.voteHelpful(id, user.getId()));
    }

    // AUTHENTICATED — Toggle not-helpful vote
    @PutMapping("/{id}/not-helpful")
    public ResponseEntity<?> voteNotHelpful(@PathVariable String id,
                                             @AuthenticationPrincipal UserDetailsImpl user) {
        if (user == null) return ResponseEntity.status(401).body("Not authenticated");
        return ResponseEntity.ok(reviewService.voteNotHelpful(id, user.getId()));
    }

    // AUTHENTICATED — Flag a review for moderation
    @PutMapping("/{id}/flag")
    public ResponseEntity<?> flagReview(@PathVariable String id,
                                         @AuthenticationPrincipal UserDetailsImpl user) {
        if (user == null) return ResponseEntity.status(401).body("Not authenticated");
        try {
            return ResponseEntity.ok(reviewService.flagReview(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ADMIN or AUTHOR — Delete review
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable String id,
                                           @AuthenticationPrincipal UserDetailsImpl user) {
        if (user == null) return ResponseEntity.status(401).body("Not authenticated");
        boolean isAdmin = user.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        try {
            reviewService.deleteReview(id, user.getId(), isAdmin);
            return ResponseEntity.ok("Review deleted");
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }
}
