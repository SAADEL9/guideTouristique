package com.saad.guideTouristique.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Data
@Document(collection = "questions")
public class Question {

    @Id
    private String id;

    private String userId;
    private String username;
    private String establishmentId;
    private EEstablishmentType establishmentType;

    private String questionText;
    private Date date;

    private List<Answer> answers;

    @Data
    public static class Answer {
        private String id;
        private String userId;
        private String username;
        private String answerText;
        private Date date;

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getAnswerText() { return answerText; }
        public void setAnswerText(String answerText) { this.answerText = answerText; }

        public Date getDate() { return date; }
        public void setDate(Date date) { this.date = date; }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEstablishmentId() { return establishmentId; }
    public void setEstablishmentId(String establishmentId) { this.establishmentId = establishmentId; }

    public EEstablishmentType getEstablishmentType() { return establishmentType; }
    public void setEstablishmentType(EEstablishmentType establishmentType) { this.establishmentType = establishmentType; }

    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }

    public Date getDate() { return date; }
    public void setDate(Date date) { this.date = date; }

    public List<Answer> getAnswers() { return answers; }
    public void setAnswers(List<Answer> answers) { this.answers = answers; }
}
