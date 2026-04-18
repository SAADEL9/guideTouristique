package com.saad.guideTouristique.controllers;

import com.saad.guideTouristique.payload.response.HotelDetailDTO;
import com.saad.guideTouristique.payload.response.HotelSummaryDTO;
import com.saad.guideTouristique.services.LiteApiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
@CrossOrigin(origins = "*")
public class LiteApiController {
    private final LiteApiService liteApiService;

    public LiteApiController(LiteApiService liteApiService) {
        this.liteApiService = liteApiService;
    }

    @GetMapping("/search")
    public ResponseEntity<List<HotelSummaryDTO>> searchHotels(
            @RequestParam String city,
            @RequestParam(defaultValue = "MA") String countryCode
    ) {
        try {
            return ResponseEntity.ok(liteApiService.searchHotels(city, countryCode));
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/details")
    public ResponseEntity<HotelDetailDTO> getHotelDetails(@RequestParam String hotelId) {
        try {
            HotelDetailDTO detail = liteApiService.getHotelDetails(hotelId);
            return ResponseEntity.ok(detail);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}
