package com.cv.springboot.di.app.springboot_cv.services;

import com.cv.springboot.di.app.springboot_cv.models.Education;
import com.cv.springboot.di.app.springboot_cv.models.Summary;
import com.cv.springboot.di.app.springboot_cv.repositories.EducationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class EducationService {
    
    private final EducationRepository educationRepository;
    
    public EducationService(EducationRepository educationRepository) {
        this.educationRepository = educationRepository;
    }
    
    // Guardar o actualizar educación
    @Transactional
    public Education saveEducation(Education education) {
        return educationRepository.save(education);
    }
    
    // Obtener todas las educaciones de un summary
    public List<Education> getEducationsBySummary(Summary summary) {
        return educationRepository.findBySummary(summary);
    }
    
    // Obtener todas las educaciones de un summary por su ID
    public List<Education> getEducationsBySummaryId(Long summaryId) {
        return educationRepository.findBySummaryId(summaryId);
    }
    
    // Obtener una educación por su ID y summary ID
    public Optional<Education> getEducationByIdAndSummaryId(Long id, Long summaryId) {
        return educationRepository.findByIdAndSummaryId(id, summaryId);
    }
    
    // Eliminar educación
    @Transactional
    public void deleteEducation(Long id) {
        educationRepository.deleteById(id);
    }
    
    // Eliminar educación verificando que pertenezca al summary
    @Transactional
    public boolean deleteEducation(Long id, Long summaryId) {
        Optional<Education> education = educationRepository.findByIdAndSummaryId(id, summaryId);
        if (education.isPresent()) {
            educationRepository.delete(education.get());
            return true;
        }
        return false;
    }
    
}