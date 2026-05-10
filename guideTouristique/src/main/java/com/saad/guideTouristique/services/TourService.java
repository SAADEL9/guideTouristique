package com.saad.guideTouristique.services;

import com.saad.guideTouristique.models.*;
import com.saad.guideTouristique.repository.ReviewRepository;
import com.saad.guideTouristique.repository.TourRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class TourService {

    @Autowired
    TourRepository tourRepository;

    @Autowired
    ReviewRepository reviewRepository;

    public List<Tour> getFilteredTours(Double minPrice, Double maxPrice, Double minRating,
                                       String city, String language) {
        List<Tour> tours = tourRepository.findByStatus(ETourStatus.APPROVED);

        if (minPrice != null)
            tours = tours.stream().filter(t -> t.getPrice() >= minPrice).collect(Collectors.toList());
        if (maxPrice != null)
            tours = tours.stream().filter(t -> t.getPrice() <= maxPrice).collect(Collectors.toList());

        if (city != null && !city.isBlank()) {
            String lc = city.toLowerCase();
            tours = tours.stream()
                .filter(t -> t.getMeetingPoint() != null && t.getMeetingPoint().toLowerCase().contains(lc))
                .collect(Collectors.toList());
        }

        if (language != null && !language.isBlank()) {
            tours = tours.stream()
                .filter(t -> t.getLanguages() != null &&
                    t.getLanguages().stream().anyMatch(l -> l.equalsIgnoreCase(language)))
                .collect(Collectors.toList());
        }

        if (minRating != null) {
            Map<String, Double> ratingMap = computeAverageRatings();
            tours = tours.stream()
                .filter(t -> ratingMap.getOrDefault(t.getId(), 0.0) >= minRating)
                .collect(Collectors.toList());
        }

        return tours;
    }

    public List<Tour> getTopRated(int limit) {
        List<Tour> tours = tourRepository.findByStatus(ETourStatus.APPROVED);
        Map<String, Double> ratingMap = computeAverageRatings();
        return tours.stream()
            .sorted(Comparator.comparingDouble(t -> -ratingMap.getOrDefault(t.getId(), 0.0)))
            .limit(limit)
            .collect(Collectors.toList());
    }

    public Map<String, Double> computeAverageRatings() {
        List<Review> reviews = reviewRepository.findByEstablishmentTypeAndStatus(
            EEstablishmentType.TOUR, EReviewStatus.APPROVED);
        Map<String, List<Integer>> grouped = new HashMap<>();
        for (Review r : reviews) {
            grouped.computeIfAbsent(r.getEstablishmentId(), k -> new ArrayList<>()).add(r.getGlobalRating());
        }
        Map<String, Double> result = new HashMap<>();
        grouped.forEach((id, ratings) ->
            result.put(id, ratings.stream().mapToInt(i -> i).average().orElse(0.0)));
        return result;
    }
}
