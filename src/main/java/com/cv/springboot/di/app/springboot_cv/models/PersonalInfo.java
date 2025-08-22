package com.cv.springboot.di.app.springboot_cv.models;

import jakarta.persistence.Embeddable;

@Embeddable
public class PersonalInfo {
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private String linkedin;
    private String portfolio;
    private String profession;
    private String summary;

    // Getters y Setters
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getLinkedin() { return linkedin; }
    public void setLinkedin(String linkedin) { this.linkedin = linkedin; }

    public String getPortfolio() { return portfolio; }
    public void setPortfolio(String portfolio) { this.portfolio = portfolio; }

    public String getProfession() { return profession; }
    public void setProfession(String profession) { this.profession = profession; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
}