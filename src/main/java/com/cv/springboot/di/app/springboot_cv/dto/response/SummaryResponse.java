package com.cv.springboot.di.app.springboot_cv.dto.response;

import com.cv.springboot.di.app.springboot_cv.models.PersonalInfo;
import java.time.LocalDateTime;
import java.util.List;

public class SummaryResponse {

    private Long id;
    private PersonalInfo personalInfo;
    private List<TechnicalSkillResponse> technicalSkills;
    private List<SoftSkillResponse> softSkills;
    private List<EducationResponse> educations;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public SummaryResponse(Long id, PersonalInfo personalInfo,
            List<TechnicalSkillResponse> technicalSkills,
            List<SoftSkillResponse> softSkills,
            List<EducationResponse> educations,
            LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.personalInfo = personalInfo;
        this.technicalSkills = technicalSkills;
        this.softSkills = softSkills;
        this.educations = educations;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public PersonalInfo getPersonalInfo() {
        return personalInfo;
    }

    public List<TechnicalSkillResponse> getTechnicalSkills() {
        return technicalSkills;
    }

    public List<SoftSkillResponse> getSoftSkills() {
        return softSkills;
    }

    public List<EducationResponse> getEducations() {
        return educations;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}