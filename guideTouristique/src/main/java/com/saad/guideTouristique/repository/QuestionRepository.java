package com.saad.guideTouristique.repository;

import com.saad.guideTouristique.models.EEstablishmentType;
import com.saad.guideTouristique.models.Question;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface QuestionRepository extends MongoRepository<Question, String> {
    List<Question> findByEstablishmentId(String establishmentId);
    List<Question> findByEstablishmentIdAndEstablishmentType(String establishmentId, EEstablishmentType type);
    List<Question> findByUserId(String userId);
}
