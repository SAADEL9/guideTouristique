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