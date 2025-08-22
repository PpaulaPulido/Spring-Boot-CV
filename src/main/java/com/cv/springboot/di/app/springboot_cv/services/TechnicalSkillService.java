package com.cv.springboot.di.app.springboot_cv.services;

import com.cv.springboot.di.app.springboot_cv.models.Summary;
import com.cv.springboot.di.app.springboot_cv.models.TechnicalSkill;
import com.cv.springboot.di.app.springboot_cv.repositories.TechnicalSkillRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TechnicalSkillService {

    private final TechnicalSkillRepository technicalSkillRepository;

    public TechnicalSkillService(TechnicalSkillRepository technicalSkillRepository) {
        this.technicalSkillRepository = technicalSkillRepository;
    }

    // Crear o actualizar una habilidad técnica
    public TechnicalSkill saveTechnicalSkill(TechnicalSkill technicalSkill) {
        return technicalSkillRepository.save(technicalSkill);
    }

    // Obtener todas las habilidades técnicas de un summary
    public List<TechnicalSkill> getTechnicalSkillsBySummary(Summary summary) {
        return technicalSkillRepository.findBySummary(summary);
    }

    // Obtener todas las habilidades técnicas de un summary por ID
    public List<TechnicalSkill> getTechnicalSkillsBySummaryId(Long summaryId) {
        return technicalSkillRepository.findBySummaryId(summaryId);
    }

    // Obtener habilidades técnicas por categoría
    public List<TechnicalSkill> getTechnicalSkillsByCategory(String category) {
        return technicalSkillRepository.findByCategory(category);
    }

    // Buscar habilidades técnicas por nombre
    public List<TechnicalSkill> searchTechnicalSkillsByName(String name) {
        return technicalSkillRepository.findByNameContaining(name);
    }

    // Obtener habilidad técnica por ID
    public Optional<TechnicalSkill> getTechnicalSkillById(Long id) {
        return technicalSkillRepository.findById(id);
    }

    // Eliminar una habilidad técnica
    public void deleteTechnicalSkill(Long id) {
        technicalSkillRepository.deleteById(id);
    }
}
