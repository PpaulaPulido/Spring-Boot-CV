package com.cv.springboot.di.app.springboot_cv.repositories;

import com.cv.springboot.di.app.springboot_cv.models.Summary;
import com.cv.springboot.di.app.springboot_cv.models.TechnicalSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TechnicalSkillRepository extends JpaRepository<TechnicalSkill, Long> {
    
    // Encontrar todas las habilidades técnicas de un summary
    List<TechnicalSkill> findBySummary(Summary summary);
    
    // Encontrar habilidades técnicas por summary ID
    List<TechnicalSkill> findBySummaryId(Long summaryId);
    
    // Encontrar habilidades técnicas por categoría
    List<TechnicalSkill> findByCategory(String category);

    // Buscar habilidades técnicas por nombre
    @Query("SELECT ts FROM TechnicalSkill ts WHERE ts.name LIKE %:name%")
    List<TechnicalSkill> findByNameContaining(@Param("name") String name);
    
}