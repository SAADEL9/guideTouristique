package com.saad.guideTouristique.services;

import com.saad.guideTouristique.models.*;
import com.saad.guideTouristique.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    ReviewRepository reviewRepository;

    public List<Review> getApprovedReviews(String establishmentId, EEstablishmentType type) {
        List<Review> reviews = type != null
            ? reviewRepository.findByEstablishmentIdAndEstablishmentType(establishmentId, type)
            : reviewRepository.findByEstablishmentId(establishmentId);
        return reviews.stream()
            .filter(r -> r.getStatus() == EReviewStatus.APPROVED)
            .toList();
    }

    public Review getReviewById(String id) {
        return reviewRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Review not found"));
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public List<Review> getMyReviews(String userId) {
        return reviewRepository.findByUserId(userId);
    }

    public List<Review> getFlaggedReviews() {
        return reviewRepository.findByFlagged(true);
    }

    public Review createReview(Review review, String userId, String username) {
        if (review.getGlobalRating() < 1 || review.getGlobalRating() > 5)
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        review.setUserId(userId);
        review.setUsername(username);
        review.setDate(new Date());
        review.setStatus(EReviewStatus.PENDING);
        review.setFlagged(false);
        review.setHelpfulVotes(new ArrayList<>());
        review.setNotHelpfulVotes(new ArrayList<>());
        return reviewRepository.save(review);
    }

    public Review updateStatus(String id, EReviewStatus status) {
        Review review = reviewRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Review not found"));
        review.setStatus(status);
        return reviewRepository.save(review);
    }

    public Review addOwnerReply(String id, String reply) {
        Review review = reviewRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Review not found"));
        review.setOwnerReply(reply);
        review.setOwnerReplyDate(new Date());
        return reviewRepository.save(review);
    }

    public Review voteHelpful(String id, String userId) {
        Review review = reviewRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Review not found"));
        List<String> helpful = new ArrayList<>(review.getHelpfulVotes() != null ? review.getHelpfulVotes() : List.of());
        List<String> notHelpful = new ArrayList<>(review.getNotHelpfulVotes() != null ? review.getNotHelpfulVotes() : List.of());
        if (helpful.contains(userId)) {
            helpful.remove(userId);
        } else {
            helpful.add(userId);
            notHelpful.remove(userId);
        }
        review.setHelpfulVotes(helpful);
        review.setNotHelpfulVotes(notHelpful);
        return reviewRepository.save(review);
    }

    public Review voteNotHelpful(String id, String userId) {
        Review review = reviewRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Review not found"));
        List<String> helpful = new ArrayList<>(review.getHelpfulVotes() != null ? review.getHelpfulVotes() : List.of());
        List<String> notHelpful = new ArrayList<>(review.getNotHelpfulVotes() != null ? review.getNotHelpfulVotes() : List.of());
        if (notHelpful.contains(userId)) {
            notHelpful.remove(userId);
        } else {
            notHelpful.add(userId);
            helpful.remove(userId);
        }
        review.setHelpfulVotes(helpful);
        review.setNotHelpfulVotes(notHelpful);
        return reviewRepository.save(review);
    }

    public Review flagReview(String id) {
        Review review = reviewRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Review not found"));
        review.setFlagged(true);
        return reviewRepository.save(review);
    }

    public Map<String, Object> getStats(String establishmentId, EEstablishmentType type) {
        List<Review> reviews = (type != null
            ? reviewRepository.findByEstablishmentIdAndEstablishmentType(establishmentId, type)
            : reviewRepository.findByEstablishmentId(establishmentId))
            .stream().filter(r -> r.getStatus() == EReviewStatus.APPROVED).collect(Collectors.toList());
        double avg = reviews.isEmpty() ? 0.0
            : reviews.stream().mapToInt(Review::getGlobalRating).average().orElse(0.0);
        Map<String, Object> stats = new HashMap<>();
        stats.put("averageRating", Math.round(avg * 10.0) / 10.0);
        stats.put("reviewCount", reviews.size());
        return stats;
    }

    public void deleteReview(String id, String userId, boolean isAdmin) {
        Review review = reviewRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Review not found"));
        if (!isAdmin && !review.getUserId().equals(userId))
            throw new RuntimeException("Not authorized to delete this review");
        reviewRepository.deleteById(id);
    }
}
