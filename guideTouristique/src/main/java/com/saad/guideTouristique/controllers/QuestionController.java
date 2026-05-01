package com.saad.guideTouristique.controllers;

import com.saad.guideTouristique.models.*;
import com.saad.guideTouristique.security.services.UserDetailsImpl;
import com.saad.guideTouristique.services.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    @Autowired
    QuestionService questionService;

    // PUBLIC — Questions for an establishment
    @GetMapping
    public List<Question> getQuestions(
            @RequestParam String establishmentId,
            @RequestParam(required = false) EEstablishmentType establishmentType) {
        return questionService.getQuestions(establishmentId, establishmentType);
    }

    // PUBLIC — Single question with its answers
    @GetMapping("/{id}")
    public ResponseEntity<?> getQuestion(@PathVariable String id) {
        try {
            return ResponseEntity.ok(questionService.getQuestionById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // AUTHENTICATED — Own questions
    @GetMapping("/my")
    public List<Question> getMyQuestions(@AuthenticationPrincipal UserDetailsImpl user) {
        return questionService.getMyQuestions(user.getId());
    }

    // AUTHENTICATED — Post a question
    @PostMapping
    public ResponseEntity<?> createQuestion(@RequestBody Question question,
                                             @AuthenticationPrincipal UserDetailsImpl user) {
        if (user == null) return ResponseEntity.status(401).body("Not authenticated");
        return ResponseEntity.ok(questionService.createQuestion(question, user.getId(), user.getUsername()));
    }

    // AUTHENTICATED — Post an answer to a question
    @PostMapping("/{id}/answers")
    public ResponseEntity<?> addAnswer(@PathVariable String id,
                                        @RequestBody Question.Answer answer,
                                        @AuthenticationPrincipal UserDetailsImpl user) {
        if (user == null) return ResponseEntity.status(401).body("Not authenticated");
        try {
            return ResponseEntity.ok(questionService.addAnswer(id, answer, user.getId(), user.getUsername()));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ADMIN or AUTHOR — Delete question
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable String id,
                                             @AuthenticationPrincipal UserDetailsImpl user) {
        if (user == null) return ResponseEntity.status(401).body("Not authenticated");
        boolean isAdmin = user.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        try {
            questionService.deleteQuestion(id, user.getId(), isAdmin);
            return ResponseEntity.ok("Question deleted");
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    // ADMIN or ANSWER AUTHOR — Delete an answer
    @DeleteMapping("/{id}/answers/{answerId}")
    public ResponseEntity<?> deleteAnswer(@PathVariable String id,
                                           @PathVariable String answerId,
                                           @AuthenticationPrincipal UserDetailsImpl user) {
        if (user == null) return ResponseEntity.status(401).body("Not authenticated");
        boolean isAdmin = user.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        try {
            return ResponseEntity.ok(questionService.deleteAnswer(id, answerId, user.getId(), isAdmin));
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }
}
