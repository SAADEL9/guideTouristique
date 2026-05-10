package com.saad.guideTouristique.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Data
@Document(collection = "tours")
public class Tour {
    @Id
    private String id;

    private String businessId; 

    private String title;
    private String description;
    private List<String> images;
    private List<String> activities;
    private double price;
    private int duration; 
    private List<String> availableDates;
    private int maxGroupSize;
    private String meetingPoint;
    private List<String> languages;
    private List<String> included;
    private List<String> notIncluded;

    private ETourStatus status = ETourStatus.PENDING;

    // Manual getters and setters since Lombok may not be working
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }

    public List<String> getActivities() { return activities; }
    public void setActivities(List<String> activities) { this.activities = activities; }

    public int getDuration() { return duration; }
    public void setDuration(int duration) { this.duration = duration; }

    public int getMaxGroupSize() { return maxGroupSize; }
    public void setMaxGroupSize(int maxGroupSize) { this.maxGroupSize = maxGroupSize; }

    public String getMeetingPoint() { return meetingPoint; }
    public void setMeetingPoint(String meetingPoint) { this.meetingPoint = meetingPoint; }

    public List<String> getLanguages() { return languages; }
    public void setLanguages(List<String> languages) { this.languages = languages; }

    public List<String> getIncluded() { return included; }
    public void setIncluded(List<String> included) { this.included = included; }

    public List<String> getNotIncluded() { return notIncluded; }
    public void setNotIncluded(List<String> notIncluded) { this.notIncluded = notIncluded; }

    public List<String> getAvailableDates() { return availableDates; }
    public void setAvailableDates(List<String> availableDates) { this.availableDates = availableDates; }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getBusinessId() {
        return businessId;
    }

    public void setBusinessId(String businessId) {
        this.businessId = businessId;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public ETourStatus getStatus() {
        return status;
    }

    public void setStatus(ETourStatus status) {
        this.status = status;
    }
}