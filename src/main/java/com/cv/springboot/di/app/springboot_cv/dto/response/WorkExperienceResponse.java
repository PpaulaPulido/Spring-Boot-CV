package com.cv.springboot.di.app.springboot_cv.dto.response;

import java.time.LocalDateTime;
import java.time.YearMonth;

public class WorkExperienceResponse {
    private Long id;
    private String position;
    private String company;
    private YearMonth startDate;
    private YearMonth endDate;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public WorkExperienceResponse(Long id, String position, String company, 
                                 YearMonth startDate, YearMonth endDate, 
                                 String description,
                                 LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.position = position;
        this.company = company;
        this.startDate = startDate;
        this.endDate = endDate;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    // Getters
    public Long getId() { return id; }
    public String getPosition() { return position; }
    public String getCompany() { return company; }
    public YearMonth getStartDate() { return startDate; }
    public YearMonth getEndDate() { return endDate; }
    public String getDescription() { return description; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}