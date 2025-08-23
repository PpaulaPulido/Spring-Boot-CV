package com.cv.springboot.di.app.springboot_cv.services;

import com.cv.springboot.di.app.springboot_cv.dto.CVUpdateRequest;
import com.cv.springboot.di.app.springboot_cv.dto.EducationRequest;
import com.cv.springboot.di.app.springboot_cv.dto.SoftSkillRequest;
import com.cv.springboot.di.app.springboot_cv.dto.TechnicalSkillRequest;
import com.cv.springboot.di.app.springboot_cv.models.Education;
import com.cv.springboot.di.app.springboot_cv.models.PersonalInfo;
import com.cv.springboot.di.app.springboot_cv.models.SoftSkill;
import com.cv.springboot.di.app.springboot_cv.models.Summary;
import com.cv.springboot.di.app.springboot_cv.models.TechnicalSkill;
import com.cv.springboot.di.app.springboot_cv.models.User;
import com.cv.springboot.di.app.springboot_cv.repositories.SummaryRepository;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SummaryService {

    private final SummaryRepository summaryRepository;
    private final EducationService educationService;

    public SummaryService(SummaryRepository summaryRepository, EducationService educationService) {
        this.summaryRepository = summaryRepository;
        this.educationService = educationService;
    }

    // Crear o actualizar un resumen
    public Summary saveSummary(Summary summary) {
        return summaryRepository.save(summary);
    }

    // Obtener todos los summaries de un usuario
    public List<Summary> getSummariesByUser(User user) {
        return summaryRepository.findByUser(user);
    }

    // Obtener todos los summaries de un usuario por su ID
    public List<Summary> getSummariesByUserId(Long userId) {
        return summaryRepository.findByUserId(userId);
    }

    // Obtener un summary por su id y usuario
    public Optional<Summary> getSummaryByIdAndUserId(Long id, Long userId) {
        return summaryRepository.findByIdAndUserId(id, userId);
    }

    // Eliminar summary
    public void deleteSummary(Long id) {
        summaryRepository.deleteById(id);
    }

    //método para manejar educaciones
    @Transactional
    public void updateEducations(Summary summary, List<EducationRequest> educationRequests) {
        summary.clearEducations();

        if (educationRequests != null) {
            for (EducationRequest educationRequest : educationRequests) {
                Education education = new Education();
                education.setInstitution(educationRequest.getInstitution());
                education.setDegree(educationRequest.getDegree());
                education.setStudyLevel(educationRequest.getStudyLevel());
                education.setStartDate(educationRequest.getStartDate());

                if (Boolean.TRUE.equals(educationRequest.getCurrent())) {
                    education.setCurrent(true);
                    education.setEndDate(null);
                } else {
                    education.setCurrent(false);
                    education.setEndDate(educationRequest.getEndDate());
                }

                education.setDescription(educationRequest.getDescription());
                summary.addEducation(education);
            }
        }
    }

    // Agrega estos métodos a tu SummaryService existente
    @Transactional
    public Summary updateSummary(Long summaryId, CVUpdateRequest updateRequest, User user) {
        Summary existingSummary = summaryRepository.findByIdAndUserId(summaryId, user.getId())
                .orElseThrow(() -> new RuntimeException("Summary no encontrado o no pertenece al usuario"));

        // Crear nueva PersonalInfo con los datos actualizados
        PersonalInfo updatedInfo = new PersonalInfo();
        updatedInfo.setFullName(updateRequest.getFullName());
        updatedInfo.setEmail(updateRequest.getEmail());
        updatedInfo.setPhone(updateRequest.getPhone());
        updatedInfo.setAddress(updateRequest.getAddress());
        updatedInfo.setLinkedin(updateRequest.getLinkedin());
        updatedInfo.setPortfolio(updateRequest.getPortfolio());
        updatedInfo.setProfession(updateRequest.getProfession());
        updatedInfo.setSummary(updateRequest.getSummary());

        // Mantener la imagen existente si no se sube una nueva
        if (updateRequest.getProfileImageFile() == null || updateRequest.getProfileImageFile().isEmpty()) {
            updatedInfo.setProfileImagePath(existingSummary.getPersonalInfo().getProfileImagePath());
        }

        // Actualizar la información personal
        existingSummary.updatePersonalInfo(updatedInfo);

        // Actualizar habilidades técnicas
        existingSummary.clearTechnicalSkills();
        if (updateRequest.getTechnicalSkills() != null) {
            for (TechnicalSkillRequest techSkillRequest : updateRequest.getTechnicalSkills()) {
                TechnicalSkill technicalSkill = new TechnicalSkill();
                technicalSkill.setName(techSkillRequest.getName());
                technicalSkill.setCategory(
                        techSkillRequest.getCategory() != null ? techSkillRequest.getCategory() : "General");
                existingSummary.addTechnicalSkill(technicalSkill);
            }
        }

        // Actualizar habilidades blandas
        existingSummary.clearSoftSkills();
        if (updateRequest.getSoftSkills() != null) {
            for (SoftSkillRequest softSkillRequest : updateRequest.getSoftSkills()) {
                SoftSkill softSkill = new SoftSkill();
                softSkill.setName(softSkillRequest.getName());
                softSkill.setDescription(softSkillRequest.getDescription());
                existingSummary.addSoftSkill(softSkill);
            }
        }

        return summaryRepository.save(existingSummary);
    }

    @Transactional
    public void deleteSummary(Long summaryId, Long userId) {
        Summary summary = summaryRepository.findByIdAndUserId(summaryId, userId)
                .orElseThrow(() -> new RuntimeException("Summary no encontrado"));
        summaryRepository.delete(summary);
    }
}
