package com.cv.springboot.di.app.springboot_cv.repositories;

import com.cv.springboot.di.app.springboot_cv.models.SoftSkill;
import com.cv.springboot.di.app.springboot_cv.models.Summary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SoftSkillRepository extends JpaRepository<SoftSkill, Long> {
    
    // Encontrar todas las habilidades blandas de un summary
    List<SoftSkill> findBySummary(Summary summary);
    
    // Encontrar habilidades blandas por summary ID
    List<SoftSkill> findBySummaryId(Long summaryId);
    
    // Encontrar habilidades blandas por nombre
    List<SoftSkill> findByNameContainingIgnoreCase(String name);
    
}