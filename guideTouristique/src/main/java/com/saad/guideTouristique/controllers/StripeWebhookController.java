package com.saad.guideTouristique.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.saad.guideTouristique.models.EReservationStatus;
import com.saad.guideTouristique.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/webhook")
public class StripeWebhookController {

    @Autowired
    ReservationRepository reservationRepository;

    @PostMapping
    public ResponseEntity<?> handleWebhook(
            @RequestBody String payload,
            @RequestHeader(value = "Stripe-Signature", required = false) String sigHeader) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(payload);
            String type = root.get("type").asText();
            String intentId = root.get("data").get("object").get("id").asText();

            if ("payment_intent.succeeded".equals(type)) {
                reservationRepository.findAll().stream()
                    .filter(r -> intentId.equals(r.getStripePaymentIntentId()))
                    .forEach(r -> {
                        r.setStatus(EReservationStatus.PAID);
                        reservationRepository.save(r);
                    });
            }
            return ResponseEntity.ok("OK");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Webhook error: " + e.getMessage());
        }
    }
}