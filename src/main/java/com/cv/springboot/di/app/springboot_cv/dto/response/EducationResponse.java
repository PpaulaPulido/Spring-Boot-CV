package com.cv.springboot.di.app.springboot_cv.dto.response;

import java.time.YearMonth;

public class EducationResponse {
    private Long id;
    private String institution;
    private String degree;
    private String studyLevel;
    private YearMonth startDate;
    private YearMonth endDate;
    private Boolean current;
    private String description;

    public EducationResponse(Long id, String institution, String degree, String studyLevel,
            YearMonth startDate, YearMonth endDate, Boolean current, String description) {
        this.id = id;
        this.institution = institution;
        this.degree = degree;
        this.studyLevel = studyLevel;
        this.startDate = startDate;
        this.endDate = endDate;
        this.current = current;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public String getInstitution() {
        return institution;
    }

    public String getDegree() {
        return degree;
    }

    public String getStudyLevel() {
        return studyLevel;
    }

    public YearMonth getStartDate() {
        return startDate;
    }

    public YearMonth getEndDate() {
        return endDate;
    }

    public Boolean getCurrent() {
        return current;
    }

    public String getDescription() {
        return description;
    }
}