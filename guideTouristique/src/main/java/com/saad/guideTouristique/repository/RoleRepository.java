package com.saad.guideTouristique.repository;

import com.saad.guideTouristique.models.ERole;
import com.saad.guideTouristique.models.Role;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface RoleRepository extends MongoRepository<Role,String> {
    Optional<Role> findByName(ERole name);
}
