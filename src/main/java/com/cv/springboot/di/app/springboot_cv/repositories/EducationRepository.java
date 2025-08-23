package com.cv.springboot.di.app.springboot_cv.repositories;

import com.cv.springboot.di.app.springboot_cv.models.Education;
import com.cv.springboot.di.app.springboot_cv.models.Summary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EducationRepository extends JpaRepository<Education, Long> {
    
    // Encontrar todas las educaciones de un summary
    List<Education> findBySummary(Summary summary);
    
    // Encontrar todas las educaciones de un summary por su ID
    List<Education> findBySummaryId(Long summaryId);
    
    // Encontrar una educación específica por ID y summary ID
    Optional<Education> findByIdAndSummaryId(Long id, Long summaryId);
    
}