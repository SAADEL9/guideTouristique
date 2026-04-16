package com.saad.guideTouristique.controllers;

import com.saad.guideTouristique.payload.response.PlaceDTO;
import com.saad.guideTouristique.services.GeoapifyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/places")
@CrossOrigin(origins = "*")
public class PlacesController{
private GeoapifyService geoapifyService;

    public PlacesController(GeoapifyService geoapifyService) {
        this.geoapifyService = geoapifyService;
    }

    @GetMapping("/restaurants")
    public ResponseEntity<List<PlaceDTO>> getRestaurants(@RequestParam String city) {
        try {
            List<PlaceDTO> restaurants = geoapifyService.getRestaurants(city);
            return ResponseEntity.ok(restaurants);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/hotels")
    public ResponseEntity<List<PlaceDTO>> getHotels(@RequestParam String city) {
        try {
            List<PlaceDTO> hotels = geoapifyService.getHotels(city);
            return ResponseEntity.ok(hotels);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }



}