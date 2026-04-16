package com.saad.guideTouristique.payload.response;

public class PlaceDTO {

    private String name;
    private String address;
    private Double lat;
    private Double lon;

    public PlaceDTO() {}

    public PlaceDTO(String name, String address, Double lat, Double lon) {
        this.name = name;
        this.address = address;
        this.lat = lat;
        this.lon = lon;
    }


    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Double getLat() { return lat; }
    public void setLat(Double lat) { this.lat = lat; }

    public Double getLon() { return lon; }
    public void setLon(Double lon) { this.lon = lon; }
}