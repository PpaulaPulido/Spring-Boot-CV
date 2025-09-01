package com.cv.springboot.di.app.springboot_cv.services;

import com.cv.springboot.di.app.springboot_cv.dto.request.CVUpdateRequest;
import com.cv.springboot.di.app.springboot_cv.dto.request.EducationRequest;
import com.cv.springboot.di.app.springboot_cv.dto.request.SoftSkillRequest;
import com.cv.springboot.di.app.springboot_cv.dto.request.TechnicalSkillRequest;
import com.cv.springboot.di.app.springboot_cv.dto.request.WorkExperienceRequest;
import com.cv.springboot.di.app.springboot_cv.dto.response.EducationResponse;
import com.cv.springboot.di.app.springboot_cv.dto.response.SoftSkillResponse;
import com.cv.springboot.di.app.springboot_cv.dto.response.SummaryResponse;
import com.cv.springboot.di.app.springboot_cv.dto.response.TechnicalSkillResponse;
import com.cv.springboot.di.app.springboot_cv.dto.response.WorkExperienceResponse;
import com.cv.springboot.di.app.springboot_cv.models.Education;
import com.cv.springboot.di.app.springboot_cv.models.PersonalInfo;
import com.cv.springboot.di.app.springboot_cv.models.SoftSkill;
import com.cv.springboot.di.app.springboot_cv.models.Summary;
import com.cv.springboot.di.app.springboot_cv.models.TechnicalSkill;
import com.cv.springboot.di.app.springboot_cv.models.User;
import com.cv.springboot.di.app.springboot_cv.models.WorkExperience;
import com.cv.springboot.di.app.springboot_cv.repositories.SummaryRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SummaryService {

    private final SummaryRepository summaryRepository;
    private final WorkExperienceService workExperienceService;

    public SummaryService(SummaryRepository summaryRepository,
            EducationService educationService,
            WorkExperienceService workExperienceService) {
        this.summaryRepository = summaryRepository;
        this.workExperienceService = workExperienceService;
    }

    // Crear o actualizar un resumen
    @Transactional
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

    // Eliminar summary por ID
    public void deleteSummary(Long id) {
        summaryRepository.deleteById(id);
    }

    // Eliminar summary verificando usuario
    @Transactional
    public void deleteSummary(Long summaryId, Long userId) {
        Summary summary = summaryRepository.findByIdAndUserId(summaryId, userId)
                .orElseThrow(() -> new RuntimeException("Summary no encontrado"));
        summaryRepository.delete(summary);
    }

    // Método para manejar educaciones
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

    // Convertir Summary a SummaryResponse
    public SummaryResponse convertToResponse(Summary summary) {
        List<TechnicalSkillResponse> techSkills = summary.getTechnicalSkills().stream()
                .map(skill -> new TechnicalSkillResponse(
                        skill.getId(),
                        skill.getName(),
                        skill.getCategory()))
                .collect(Collectors.toList());

        List<SoftSkillResponse> softSkills = summary.getSoftSkills().stream()
                .map(skill -> new SoftSkillResponse(
                        skill.getId(),
                        skill.getName(),
                        skill.getDescription()))
                .collect(Collectors.toList());

        List<EducationResponse> educations = summary.getEducations().stream()
                .map(edu -> new EducationResponse(
                        edu.getId(),
                        edu.getInstitution(),
                        edu.getDegree(),
                        edu.getStudyLevel(),
                        edu.getStartDate(),
                        edu.getEndDate(),
                        edu.getCurrent(),
                        edu.getDescription()))
                .collect(Collectors.toList());

        //AGREGAR EXPERIENCIAS LABORALES
        List<WorkExperienceResponse> workExperiences = summary.getWorkExperiences().stream()
                .map(workExperienceService::convertToResponse) // Usar el servicio
                .collect(Collectors.toList());

        return new SummaryResponse(
                summary.getId(),
                summary.getPersonalInfo(),
                techSkills,
                softSkills,
                educations,
                workExperiences, 
                summary.getCreatedAt(),
                summary.getUpdatedAt());
    }

    // Actualizar summary completo
    @Transactional
    public Summary updateSummary(Long summaryId, CVUpdateRequest updateRequest, User user) {
        Summary existingSummary = summaryRepository.findByIdAndUserId(summaryId, user.getId())
                .orElseThrow(() -> new RuntimeException("Summary no encontrado o no pertenece al usuario"));

        // Obtener PersonalInfo existente y actualizarla
        PersonalInfo personalInfo = existingSummary.getPersonalInfo();
        personalInfo.setFullName(updateRequest.getFullName());
        personalInfo.setEmail(updateRequest.getEmail());
        personalInfo.setPhone(updateRequest.getPhone());
        personalInfo.setAddress(updateRequest.getAddress());
        personalInfo.setLinkedin(updateRequest.getLinkedin());
        personalInfo.setPortfolio(updateRequest.getPortfolio());
        personalInfo.setProfession(updateRequest.getProfession());
        personalInfo.setSummary(updateRequest.getSummary());
        personalInfo.setTheme(updateRequest.getTheme());

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

        // Actualizar educaciones
        updateEducations(existingSummary, updateRequest.getEducations());

        // Actualizar experiencias laborales
        existingSummary.clearWorkExperiences();
        if (updateRequest.getWorkExperiences() != null) {
            for (WorkExperienceRequest workExperienceRequest : updateRequest.getWorkExperiences()) {
                WorkExperience workExperience = new WorkExperience();
                workExperience.setPosition(workExperienceRequest.getPosition());
                workExperience.setCompany(workExperienceRequest.getCompany());
                workExperience.setStartDate(workExperienceRequest.getStartDate());
                workExperience.setEndDate(workExperienceRequest.getEndDate());
                workExperience.setDescription(workExperienceRequest.getDescription());
                existingSummary.addWorkExperience(workExperience);
            }
        }

        return summaryRepository.save(existingSummary);
    }

}