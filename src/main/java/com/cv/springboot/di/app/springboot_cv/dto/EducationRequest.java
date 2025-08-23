package com.cv.springboot.di.app.springboot_cv.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.YearMonth;

public class EducationRequest {
    
    private Long id;
    
    @NotBlank(message = "La institución es obligatoria")
    private String institution;
    
    @NotBlank(message = "El título es obligatorio")
    private String degree;
    
    private String studyLevel;
    
    @NotNull(message = "La fecha de inicio es obligatoria")
    private YearMonth startDate;
    
    private YearMonth endDate;
    
    private Boolean current = false;
    
    private String description;
    
    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getInstitution() { return institution; }
    public void setInstitution(String institution) { this.institution = institution; }
    
    public String getDegree() { return degree; }
    public void setDegree(String degree) { this.degree = degree; }
    
    public String getStudyLevel() { return studyLevel; }
    public void setStudyLevel(String studyLevel) { this.studyLevel = studyLevel; }
    
    public YearMonth getStartDate() { return startDate; }
    public void setStartDate(YearMonth startDate) { this.startDate = startDate; }
    
    public YearMonth getEndDate() { return endDate; }
    public void setEndDate(YearMonth endDate) { this.endDate = endDate; }
    
    public Boolean getCurrent() { return current; }
    public void setCurrent(Boolean current) { this.current = current; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}