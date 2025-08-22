package com.cv.springboot.di.app.springboot_cv.services;

import com.cv.springboot.di.app.springboot_cv.models.SoftSkill;
import com.cv.springboot.di.app.springboot_cv.models.Summary;
import com.cv.springboot.di.app.springboot_cv.repositories.SoftSkillRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SoftSkillService {

    private final SoftSkillRepository softSkillRepository;

    public SoftSkillService(SoftSkillRepository softSkillRepository) {
        this.softSkillRepository = softSkillRepository;
    }

    // Crear o actualizar una soft skill
    public SoftSkill saveSoftSkill(SoftSkill softSkill) {
        return softSkillRepository.save(softSkill);
    }

    // Obtener todas las soft skills de un summary
    public List<SoftSkill> getSoftSkillsBySummary(Summary summary) {
        return softSkillRepository.findBySummary(summary);
    }

    // Obtener todas las soft skills de un summary por ID
    public List<SoftSkill> getSoftSkillsBySummaryId(Long summaryId) {
        return softSkillRepository.findBySummaryId(summaryId);
    }

    // Buscar soft skills por nombre (ignora mayúsculas/minúsculas)
    public List<SoftSkill> searchSoftSkillsByName(String name) {
        return softSkillRepository.findByNameContainingIgnoreCase(name);
    }

    // Obtener soft skill por ID
    public Optional<SoftSkill> getSoftSkillById(Long id) {
        return softSkillRepository.findById(id);
    }

    // Eliminar una soft skill
    public void deleteSoftSkill(Long id) {
        softSkillRepository.deleteById(id);
    }
}
