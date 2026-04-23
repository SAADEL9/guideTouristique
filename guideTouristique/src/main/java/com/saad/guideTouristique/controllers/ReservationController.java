package com.saad.guideTouristique.controllers;

import com.saad.guideTouristique.models.*;
import com.saad.guideTouristique.repository.*;
import com.saad.guideTouristique.security.services.UserDetailsImpl;
import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired ReservationRepository reservationRepository;
    @Autowired TourRepository tourRepository;

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    
    @PostMapping
    public ResponseEntity<?> createReservation(
            @RequestBody Reservation reservation,
            @AuthenticationPrincipal UserDetailsImpl user) throws Exception {

        if (user == null) {
            return ResponseEntity.status(401).body("Not authenticated");
        }

        Tour tour = tourRepository.findById(reservation.getTourId())
            .orElseThrow(() -> new RuntimeException("Tour not found"));

        reservation.setUserId(user.getId());
        reservation.setTotalPrice(tour.getPrice() * reservation.getNumberOfPeople());
        reservation.setStatus(EReservationStatus.PENDING);

        // Stripe Payment Intent
        Stripe.apiKey = stripeSecretKey;
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
            .setAmount((long)(reservation.getTotalPrice() * 100))
            .setCurrency("usd")
            .build();
        PaymentIntent intent = PaymentIntent.create(params);
        reservation.setStripePaymentIntentId(intent.getId());

        reservationRepository.save(reservation);

        return ResponseEntity.ok(Map.of(
            "reservation", reservation,
            "clientSecret", intent.getClientSecret()
        ));
    }


    @GetMapping("/my")
    public ResponseEntity<?> getMyReservations(
            @AuthenticationPrincipal UserDetailsImpl user) {

        if (user == null) {
            return ResponseEntity.status(401).body("Not authenticated");
        }

        List<Reservation> reservations = reservationRepository.findByUserId(user.getId());
        return ResponseEntity.ok(reservations);
    }

    
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable String id,
            @RequestParam EReservationStatus status,
            @AuthenticationPrincipal UserDetailsImpl user) {

        if (user == null) {
            return ResponseEntity.status(401).body("Not authenticated");
        }

        Reservation r = reservationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Not found"));
        r.setStatus(status);
        return ResponseEntity.ok(reservationRepository.save(r));
    }
}