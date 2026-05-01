package com.saad.guideTouristique.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Data
@Document(collection = "reviews")
public class Review {

    @Id
    private String id;

    private String userId;
    private String username;
    private String establishmentId;
    private EEstablishmentType establishmentType;

    private String text;
    private int globalRating;
    private Map<String, Integer> categoryRatings;
    private List<String> photos;
    private Date date;

    private boolean flagged = false;
    private EReviewStatus status = EReviewStatus.PENDING;

    private String ownerReply;
    private Date ownerReplyDate;

    private List<String> helpfulVotes;
    private List<String> notHelpfulVotes;

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

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public int getGlobalRating() { return globalRating; }
    public void setGlobalRating(int globalRating) { this.globalRating = globalRating; }

    public Map<String, Integer> getCategoryRatings() { return categoryRatings; }
    public void setCategoryRatings(Map<String, Integer> categoryRatings) { this.categoryRatings = categoryRatings; }

    public List<String> getPhotos() { return photos; }
    public void setPhotos(List<String> photos) { this.photos = photos; }

    public Date getDate() { return date; }
    public void setDate(Date date) { this.date = date; }

    public boolean isFlagged() { return flagged; }
    public void setFlagged(boolean flagged) { this.flagged = flagged; }

    public EReviewStatus getStatus() { return status; }
    public void setStatus(EReviewStatus status) { this.status = status; }

    public String getOwnerReply() { return ownerReply; }
    public void setOwnerReply(String ownerReply) { this.ownerReply = ownerReply; }

    public Date getOwnerReplyDate() { return ownerReplyDate; }
    public void setOwnerReplyDate(Date ownerReplyDate) { this.ownerReplyDate = ownerReplyDate; }

    public List<String> getHelpfulVotes() { return helpfulVotes; }
    public void setHelpfulVotes(List<String> helpfulVotes) { this.helpfulVotes = helpfulVotes; }

    public List<String> getNotHelpfulVotes() { return notHelpfulVotes; }
    public void setNotHelpfulVotes(List<String> notHelpfulVotes) { this.notHelpfulVotes = notHelpfulVotes; }
}
