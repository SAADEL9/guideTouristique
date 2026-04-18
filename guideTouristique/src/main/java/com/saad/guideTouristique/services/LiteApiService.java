package com.saad.guideTouristique.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.saad.guideTouristique.payload.response.HotelSummaryDTO;
import com.saad.guideTouristique.payload.response.HotelDetailDTO;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import jakarta.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

@Service
public class LiteApiService {

    private final WebClient webClient;

    @Value("${liteapi.key}")
    private String apiKey;

    public LiteApiService(@Qualifier("liteApiClient") WebClient webClient) {
        this.webClient = webClient;
    }

    // ─── Check API key is loading correctly ──────────────────────────────────
    @PostConstruct
    public void init() {
        System.out.println("✅ LiteAPI Key loaded: " + apiKey);
    }

    // ─── Search Hotels ────────────────────────────────────────────────────────
    public List<HotelSummaryDTO> searchHotels(String city, String countryCode) {

        JsonNode response = webClient.get()
                .uri(uri -> uri
                        .path("/v3.0/data/hotels")
                        .queryParam("cityName", city)
                        .queryParam("countryCode", countryCode)
                        .queryParam("limit", 20)
                        .build())
                .header("X-API-Key", apiKey)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();
        System.out.println("RAW LITEAPI RESPONSE: " + response.toPrettyString());

        JsonNode hotelsNode = response.get("data");

        List<HotelSummaryDTO> hotels = new ArrayList<>();

        if (hotelsNode == null || !hotelsNode.isArray()) {
            return hotels; // return empty list if no data
        }

        for (JsonNode h : hotelsNode) {
            HotelSummaryDTO dto = new HotelSummaryDTO();

            dto.setHotelId(h.path("id").asText());
            dto.setName(h.path("name").asText());
            dto.setAddress(h.path("address").asText());
            dto.setCity(h.path("city").asText());
            dto.setCountry(h.path("country").asText());
            dto.setStarRating(h.path("stars").asInt());
            dto.setReviewScore(h.path("rating").isMissingNode() ? null : h.path("rating").asDouble());
            dto.setReviewCount(h.path("reviewCount").isMissingNode() ? null : h.path("reviewCount").asInt());
            dto.setMainImage(h.path("main_photo").asText(h.path("thumbnail").asText("")));

            hotels.add(dto);
        }

        // ─── Sort by review score descending ─────────────────────────────────
        hotels.sort((a, b) -> Double.compare(
                b.getReviewScore() != null ? b.getReviewScore() : 0,
                a.getReviewScore() != null ? a.getReviewScore() : 0
        ));

        return hotels;
    }

    // ─── Get Hotel Details ────────────────────────────────────────────────────
    public HotelDetailDTO getHotelDetails(String hotelId) {

        JsonNode response = webClient.get()
                .uri(uri -> uri
                        .path("/v3.0/data/hotel")
                        .queryParam("hotelId", hotelId)
                        .build())
                .header("X-API-Key", apiKey)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();
        System.out.println("RAW LITEAPI RESPONSE: " + response.toPrettyString());

        JsonNode h = response.get("data");

        HotelDetailDTO dto = new HotelDetailDTO();

        dto.setHotelId(h.path("id").asText());
        dto.setName(h.path("name").asText());
        dto.setDescription(h.path("hotelDescription").asText());
        dto.setAddress(h.path("address").asText());
        dto.setStarRating(h.path("starRating").isMissingNode() ? h.path("stars").asInt() : h.path("starRating").asInt());
        dto.setReviewScore(h.path("rating").isMissingNode() ? null : h.path("rating").asDouble());
        dto.setReviewCount(h.path("reviewCount").isMissingNode() ? null : h.path("reviewCount").asInt());

        JsonNode location = h.path("location");
        if (!location.isMissingNode()) {
            dto.setLat(location.path("latitude").asDouble());
            dto.setLon(location.path("longitude").asDouble());
        } else {
            dto.setLat(h.path("latitude").isMissingNode() ? null : h.path("latitude").asDouble());
            dto.setLon(h.path("longitude").isMissingNode() ? null : h.path("longitude").asDouble());
        }

        JsonNode hotelImages = h.path("hotelImages");
        List<String> imageUrls = new ArrayList<>();
        if (hotelImages.isArray()) {
            for (JsonNode img : hotelImages) {
                String url = img.path("url").asText();
                if (!url.isBlank()) {
                    imageUrls.add(url);
                }
            }
        }
        if (imageUrls.isEmpty() && !h.path("main_photo").asText("").isBlank()) {
            imageUrls.add(h.path("main_photo").asText());
        }
        dto.setImages(imageUrls);

        JsonNode facilities = h.path("facilities");
        List<String> amenities = new ArrayList<>();
        if (facilities.isArray()) {
            for (JsonNode facility : facilities) {
                String name = facility.path("name").asText();
                if (!name.isBlank()) {
                    amenities.add(name);
                }
            }
        } else if (h.path("hotelFacilities").isArray()) {
            for (JsonNode amenityNode : h.path("hotelFacilities")) {
                String name = amenityNode.asText();
                if (!name.isBlank()) {
                    amenities.add(name);
                }
            }
        }
        dto.setAmenities(amenities);

        dto.setPhone(h.path("phone").asText(""));
        dto.setEmail(h.path("email").asText(""));
        dto.setWebsite(h.path("website").asText(""));

        return dto;
    }
}