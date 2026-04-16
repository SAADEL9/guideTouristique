package com.saad.guideTouristique.services;

import com.saad.guideTouristique.payload.response.PlaceDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class GeoapifyService {

    private final WebClient webClient;

    @Value("${geoapify.api.key}")
    private String apiKey;

    public GeoapifyService(WebClient webClient) {
        this.webClient = webClient;
    }

    // ─── Geocode city → get lat/lon ───────────────────────────────────────
    private double[] geocode(String city) {
        Map response = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/v1/geocode/search")
                        .queryParam("text", city)
                        .queryParam("apiKey", apiKey)
                        .build())
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        List<Map> features = (List<Map>) response.get("features");
        if (features == null || features.isEmpty()) {
            throw new RuntimeException("City not found: " + city);
        }

        Map geometry = (Map) features.get(0).get("geometry");
        List<Double> coordinates = (List<Double>) geometry.get("coordinates");

        // Geoapify returns [lon, lat]
        double lon = coordinates.get(0);
        double lat = coordinates.get(1);

        return new double[]{lat, lon};
    }

    // ─── Shared method to fetch places by category ────────────────────────
    private List<PlaceDTO> fetchPlaces(String city, String category) {
        double[] coords = geocode(city);
        double lat = coords[0];
        double lon = coords[1];

        Map response = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/v2/places")
                        .queryParam("categories", category)
                        .queryParam("filter", "circle:" + lon + "," + lat + ",3000")
                        .queryParam("limit", 10)
                        .queryParam("apiKey", apiKey)
                        .build())
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        List<Map> features = (List<Map>) response.get("features");

        return features.stream().map(feature -> {
            Map properties = (Map) feature.get("properties");
            PlaceDTO dto = new PlaceDTO();
            dto.setName((String) properties.get("name"));
            dto.setAddress((String) properties.get("address_line1"));
            dto.setLat((Double) properties.get("lat"));
            dto.setLon((Double) properties.get("lon"));
            return dto;
        }).collect(Collectors.toList());
    }

    // ─── Public methods called by controller ──────────────────────────────
    public List<PlaceDTO> getRestaurants(String city) {
        return fetchPlaces(city, "catering.restaurant");
    }

    public List<PlaceDTO> getHotels(String city) {
        return fetchPlaces(city, "accommodation.hotel");
    }
}