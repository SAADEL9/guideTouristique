package com.saad.guideTouristique.payload.response;

import java.util.List;

public class HotelDetailDTO {

    private String hotelId;
    private String name;
    private String description;
    private String address;
    private Double lat;
    private Double lon;
    private Integer starRating;
    private Double reviewScore;
    private Integer reviewCount;
    private List<String> images;
    private List<String> amenities;
    private String phone;
    private String email;
    private String website;

    // ─── Getters & Setters ────────────────────────────────────────────────────
    public String getHotelId() { return hotelId; }
    public void setHotelId(String hotelId) { this.hotelId = hotelId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Double getLat() { return lat; }
    public void setLat(Double lat) { this.lat = lat; }

    public Double getLon() { return lon; }
    public void setLon(Double lon) { this.lon = lon; }

    public Integer getStarRating() { return starRating; }
    public void setStarRating(Integer starRating) { this.starRating = starRating; }

    public Double getReviewScore() { return reviewScore; }
    public void setReviewScore(Double reviewScore) { this.reviewScore = reviewScore; }

    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }

    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }

    public List<String> getAmenities() { return amenities; }
    public void setAmenities(List<String> amenities) { this.amenities = amenities; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }
}