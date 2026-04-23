package com.saad.guideTouristique.repository;

import com.saad.guideTouristique.models.Tour;
import com.saad.guideTouristique.models.ETourStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TourRepository extends MongoRepository<Tour, String> {
    List<Tour> findByBusinessId(String businessId);
    List<Tour> findByStatus(ETourStatus status);
}