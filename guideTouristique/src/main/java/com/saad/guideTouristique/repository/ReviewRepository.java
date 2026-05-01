package com.saad.guideTouristique.repository;

import com.saad.guideTouristique.models.EEstablishmentType;
import com.saad.guideTouristique.models.EReviewStatus;
import com.saad.guideTouristique.models.Review;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByEstablishmentId(String establishmentId);
    List<Review> findByEstablishmentIdAndEstablishmentType(String establishmentId, EEstablishmentType type);
    List<Review> findByUserId(String userId);
    List<Review> findByStatus(EReviewStatus status);
    List<Review> findByFlagged(boolean flagged);
}
