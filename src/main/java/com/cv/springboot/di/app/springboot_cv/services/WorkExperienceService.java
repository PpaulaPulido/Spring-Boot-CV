package com.cv.springboot.di.app.springboot_cv.services;

import com.cv.springboot.di.app.springboot_cv.dto.response.WorkExperienceResponse;
import com.cv.springboot.di.app.springboot_cv.models.WorkExperience;
import com.cv.springboot.di.app.springboot_cv.models.Summary;
import com.cv.springboot.di.app.springboot_cv.repositories.WorkExperienceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class WorkExperienceService {
    
    private final WorkExperienceRepository workExperienceRepository;
    
    public WorkExperienceService(WorkExperienceRepository workExperienceRepository) {
        this.workExperienceRepository = workExperienceRepository;
    }
    
    @Transactional
    public WorkExperience saveWorkExperience(WorkExperience workExperience) {
        return workExperienceRepository.save(workExperience);
    }
    
    public List<WorkExperience> getWorkExperiencesBySummary(Summary summary) {
        return workExperienceRepository.findBySummary(summary);
    }
    
    public List<WorkExperience> getWorkExperiencesBySummaryId(Long summaryId) {
        return workExperienceRepository.findBySummaryId(summaryId);
    }
    
    public Optional<WorkExperience> getWorkExperienceByIdAndSummaryId(Long id, Long summaryId) {
        return workExperienceRepository.findByIdAndSummaryId(id, summaryId);
    }
    
    @Transactional
    public void deleteWorkExperience(Long id) {
        workExperienceRepository.deleteById(id);
    }
    
    @Transactional
    public boolean deleteWorkExperience(Long id, Long summaryId) {
        Optional<WorkExperience> workExperience = workExperienceRepository.findByIdAndSummaryId(id, summaryId);
        if (workExperience.isPresent()) {
            workExperienceRepository.delete(workExperience.get());
            return true;
        }
        return false;
    }
    
    public WorkExperienceResponse convertToResponse(WorkExperience workExperience) {
        return new WorkExperienceResponse(
            workExperience.getId(),
            workExperience.getPosition(),
            workExperience.getCompany(),
            workExperience.getStartDate(),
            workExperience.getEndDate(),
            workExperience.getDescription(),
            workExperience.isCurrent(),
            workExperience.getCreatedAt(),
            workExperience.getUpdatedAt()
        );
    }


}