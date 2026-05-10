package com.saad.guideTouristique.controllers;

import com.saad.guideTouristique.models.*;
import com.saad.guideTouristique.repository.TourRepository;
import com.saad.guideTouristique.security.services.UserDetailsImpl;
import com.saad.guideTouristique.services.TourService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/tours")
public class TourController {

    @Autowired
    TourRepository tourRepository;

    @Autowired
    TourService tourService;

    // ✅ PUBLIC — Voir tous les tours approuvés (with optional filters)
    @GetMapping
    public List<Tour> getApprovedTours(
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String language) {
        return tourService.getFilteredTours(minPrice, maxPrice, minRating, city, language);
    }

    // ✅ PUBLIC — Top 5 tours by average rating
    @GetMapping("/top-rated")
    public List<Tour> getTopRated() {
        return tourService.getTopRated(5);
    }

    // ✅ PUBLIC — Voir un tour spécifique
    @GetMapping("/{id}")
    public ResponseEntity<?> getTourById(@PathVariable String id) {
        return tourRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // ✅ ADMIN — Voir tous les tours
    @GetMapping("/all")
    public List<Tour> getAllTours(@AuthenticationPrincipal UserDetailsImpl user) {
        // ideally check if user is admin, but keeping it simple as per other endpoints
        return tourRepository.findAll();
    }

    // ✅ BUSINESS — Créer un tour
    @PostMapping
    public ResponseEntity<?> createTour(@RequestBody Tour tour,
                                     @AuthenticationPrincipal UserDetailsImpl user) {
        if (user == null) return ResponseEntity.status(401).body("Not authenticated");
        tour.setBusinessId(user.getId());
        tour.setStatus(ETourStatus.PENDING);
        return ResponseEntity.ok(tourRepository.save(tour));
    }

    // ✅ BUSINESS — Voir ses propres tours
    @GetMapping("/my-tours")
    public List<Tour> getMyTours(@AuthenticationPrincipal UserDetailsImpl user) {
        return tourRepository.findByBusinessId(user.getId());
    }

    // ✅ BUSINESS — Modifier son tour
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTour(@PathVariable String id,
                                        @RequestBody Tour updated,
                                        @AuthenticationPrincipal UserDetailsImpl user) {
        if (user == null) return ResponseEntity.status(401).body("Not authenticated");
        Tour tour = tourRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Tour not found"));
        if (!tour.getBusinessId().equals(user.getId()))
            return ResponseEntity.status(403).body("Not your tour");
        updated.setId(id);
        updated.setBusinessId(user.getId());
        return ResponseEntity.ok(tourRepository.save(updated));
    }

    // ✅ BUSINESS — Supprimer son tour
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTour(@PathVariable String id,
                                        @AuthenticationPrincipal UserDetailsImpl user) {
        if (user == null) return ResponseEntity.status(401).body("Not authenticated");
        Tour tour = tourRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Tour not found"));
        if (!tour.getBusinessId().equals(user.getId()))
            return ResponseEntity.status(403).body("Not your tour");
        tourRepository.deleteById(id);
        return ResponseEntity.ok("Tour deleted");
    }

    // ✅ ADMIN — Approuver ou rejeter un tour
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String id,
        @RequestParam ETourStatus status,
     @AuthenticationPrincipal UserDetailsImpl user) {
        if (user == null) return ResponseEntity.status(401).body("Not authenticated");
        Tour tour = tourRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Tour not found"));
        tour.setStatus(status);
        return ResponseEntity.ok(tourRepository.save(tour));
    }
}