package com.saad.guideTouristique.payload.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class BusinessSignupRequest {
    @NotBlank
    @Size(min = 3, max = 20)
    private String username;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;

    @NotBlank
    private String companyName;

    private String description;

    @NotBlank
    private String contactInfo;

    // Manual getters
    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getCompanyName() {
        return companyName;
    }

    public String getDescription() {
        return description;
    }

    public String getContactInfo() {
        return contactInfo;
    }
}