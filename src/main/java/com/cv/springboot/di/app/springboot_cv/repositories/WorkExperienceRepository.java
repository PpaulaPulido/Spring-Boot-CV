package com.cv.springboot.di.app.springboot_cv.repositories;

import com.cv.springboot.di.app.springboot_cv.models.WorkExperience;
import com.cv.springboot.di.app.springboot_cv.models.Summary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkExperienceRepository extends JpaRepository<WorkExperience, Long> {
    
    List<WorkExperience> findBySummary(Summary summary);
    
    List<WorkExperience> findBySummaryId(Long summaryId);
    
    Optional<WorkExperience> findByIdAndSummaryId(Long id, Long summaryId);
}