package com.saad.guideTouristique.repository;

import com.saad.guideTouristique.models.Reservation;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ReservationRepository extends MongoRepository<Reservation, String> {
    List<Reservation> findByUserId(String userId);
    List<Reservation> findByTourId(String tourId);
}