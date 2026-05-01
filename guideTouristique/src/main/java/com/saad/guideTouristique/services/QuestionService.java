package com.saad.guideTouristique.services;

import com.saad.guideTouristique.models.*;
import com.saad.guideTouristique.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class QuestionService {

    @Autowired
    QuestionRepository questionRepository;

    public List<Question> getQuestions(String establishmentId, EEstablishmentType type) {
        return type != null
            ? questionRepository.findByEstablishmentIdAndEstablishmentType(establishmentId, type)
            : questionRepository.findByEstablishmentId(establishmentId);
    }

    public Question getQuestionById(String id) {
        return questionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Question not found"));
    }

    public List<Question> getMyQuestions(String userId) {
        return questionRepository.findByUserId(userId);
    }

    public Question createQuestion(Question question, String userId, String username) {
        question.setUserId(userId);
        question.setUsername(username);
        question.setDate(new Date());
        question.setAnswers(new ArrayList<>());
        return questionRepository.save(question);
    }

    public Question addAnswer(String questionId, Question.Answer answer, String userId, String username) {
        Question question = questionRepository.findById(questionId)
            .orElseThrow(() -> new RuntimeException("Question not found"));
        answer.setId(UUID.randomUUID().toString());
        answer.setUserId(userId);
        answer.setUsername(username);
        answer.setDate(new Date());
        List<Question.Answer> answers = new ArrayList<>(
            question.getAnswers() != null ? question.getAnswers() : List.of()
        );
        answers.add(answer);
        question.setAnswers(answers);
        return questionRepository.save(question);
    }

    public void deleteQuestion(String id, String userId, boolean isAdmin) {
        Question question = questionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Question not found"));
        if (!isAdmin && !question.getUserId().equals(userId))
            throw new RuntimeException("Not authorized to delete this question");
        questionRepository.deleteById(id);
    }

    public Question deleteAnswer(String questionId, String answerId, String userId, boolean isAdmin) {
        Question question = questionRepository.findById(questionId)
            .orElseThrow(() -> new RuntimeException("Question not found"));
        List<Question.Answer> answers = question.getAnswers();
        if (answers == null) throw new RuntimeException("Answer not found");
        Question.Answer target = answers.stream()
            .filter(a -> a.getId().equals(answerId))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Answer not found"));
        if (!isAdmin && !target.getUserId().equals(userId))
            throw new RuntimeException("Not authorized to delete this answer");
        answers.removeIf(a -> a.getId().equals(answerId));
        question.setAnswers(answers);
        return questionRepository.save(question);
    }
}
