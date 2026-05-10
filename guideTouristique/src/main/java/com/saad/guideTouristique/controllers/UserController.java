package com.saad.guideTouristique.controllers;

import com.saad.guideTouristique.models.Tour;
import com.saad.guideTouristique.models.User;
import com.saad.guideTouristique.repository.TourRepository;
import com.saad.guideTouristique.repository.UserRepository;
import com.saad.guideTouristique.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    TourRepository tourRepository;

    @PostMapping("/favorites/{tourId}")
    public ResponseEntity<?> addFavorite(@PathVariable String tourId,
                                         @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) return ResponseEntity.status(401).body("Not authenticated");
        User user = userRepository.findById(userDetails.getId())
            .orElseThrow(() -> new RuntimeException("User not found"));
        List<String> favorites = user.getFavoriteIds() == null
            ? new ArrayList<>() : new ArrayList<>(user.getFavoriteIds());
        if (!favorites.contains(tourId)) favorites.add(tourId);
        user.setFavoriteIds(favorites);
        userRepository.save(user);
        return ResponseEntity.ok("Added to favorites");
    }

    @DeleteMapping("/favorites/{tourId}")
    public ResponseEntity<?> removeFavorite(@PathVariable String tourId,
                                            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) return ResponseEntity.status(401).body("Not authenticated");
        User user = userRepository.findById(userDetails.getId())
            .orElseThrow(() -> new RuntimeException("User not found"));
        List<String> favorites = user.getFavoriteIds() == null
            ? new ArrayList<>() : new ArrayList<>(user.getFavoriteIds());
        favorites.remove(tourId);
        user.setFavoriteIds(favorites);
        userRepository.save(user);
        return ResponseEntity.ok("Removed from favorites");
    }

    @GetMapping("/favorites")
    public ResponseEntity<?> getFavorites(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) return ResponseEntity.status(401).body("Not authenticated");
        User user = userRepository.findById(userDetails.getId())
            .orElseThrow(() -> new RuntimeException("User not found"));
        List<String> ids = user.getFavoriteIds() == null ? new ArrayList<>() : user.getFavoriteIds();
        List<Tour> favoriteTours = ids.stream()
            .map(id -> tourRepository.findById(id).orElse(null))
            .filter(t -> t != null)
            .collect(Collectors.toList());
        return ResponseEntity.ok(favoriteTours);
    }

    @GetMapping("/favorites/ids")
    public ResponseEntity<?> getFavoriteIds(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) return ResponseEntity.status(401).body("Not authenticated");
        User user = userRepository.findById(userDetails.getId())
            .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user.getFavoriteIds() == null ? new ArrayList<>() : user.getFavoriteIds());
    }
}
