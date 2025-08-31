package com.cv.springboot.di.app.springboot_cv.controllers;

import com.cv.springboot.di.app.springboot_cv.dto.request.CVRequest;
import com.cv.springboot.di.app.springboot_cv.dto.request.CVUpdateRequest;
import com.cv.springboot.di.app.springboot_cv.dto.request.EducationRequest;
import com.cv.springboot.di.app.springboot_cv.dto.request.SoftSkillRequest;
import com.cv.springboot.di.app.springboot_cv.dto.request.TechnicalSkillRequest;
import com.cv.springboot.di.app.springboot_cv.dto.request.WorkExperienceRequest;
import com.cv.springboot.di.app.springboot_cv.dto.response.SummaryResponse;
import com.cv.springboot.di.app.springboot_cv.models.*;
import com.cv.springboot.di.app.springboot_cv.services.SummaryService;
import com.cv.springboot.di.app.springboot_cv.services.TechnicalSkillService;
import com.cv.springboot.di.app.springboot_cv.services.SoftSkillService;
import com.cv.springboot.di.app.springboot_cv.services.UserService;
import com.cv.springboot.di.app.springboot_cv.services.EducationService;
import com.cv.springboot.di.app.springboot_cv.services.WorkExperienceService;
import com.cv.springboot.di.app.springboot_cv.services.ImageService;
import jakarta.validation.Valid;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import java.io.IOException;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;

@Controller
@RequestMapping("/cv")
public class CVController {

    private final SummaryService summaryService;
    private final TechnicalSkillService technicalSkillService;
    private final SoftSkillService softSkillService;
    private final UserService userService;
    private final ImageService imageService;
    private final EducationService educationService;
    private final WorkExperienceService workExperienceService;

    @Value("${app.upload.dir:uploads/images/}")
    private String uploadDirectory;

    public CVController(SummaryService summaryService,
            TechnicalSkillService technicalSkillService,
            SoftSkillService softSkillService,
            UserService userService,
            EducationService educationService,
            WorkExperienceService workExperienceService,
            ImageService imageService) {
        this.summaryService = summaryService;
        this.technicalSkillService = technicalSkillService;
        this.softSkillService = softSkillService;
        this.userService = userService;
        this.imageService = imageService;
        this.educationService = educationService;
        this.workExperienceService = workExperienceService;
    }

    @GetMapping("/templateCv")
    public String showCVTemplateForm(Model model, Authentication authentication) {
        model.addAttribute("cvRequest", new CVRequest());
        model.addAttribute("editMode", false);
        return "template_cv";
    }

    @PostMapping("/create")
    public String createCV(@Valid @ModelAttribute("cvRequest") CVRequest cvRequest,
            BindingResult result,
            Authentication authentication,
            RedirectAttributes redirectAttributes) {

        if (cvRequest.getTechnicalSkills() == null || cvRequest.getTechnicalSkills().isEmpty()) {
            result.rejectValue("technicalSkills", "NotEmpty", "Debes agregar al menos una habilidad técnica");
        }
        if (cvRequest.getSoftSkills() == null || cvRequest.getSoftSkills().isEmpty()) {
            result.rejectValue("softSkills", "NotEmpty", "Debes agregar al menos una habilidad blanda");
        }
        if (cvRequest.getEducations() == null || cvRequest.getEducations().isEmpty()) {
            result.rejectValue("educations", "NotEmpty", "Debes agregar al menos una educación");
        }
        if (cvRequest.getWorkExperiences() == null || cvRequest.getWorkExperiences().isEmpty()) {
            result.rejectValue("workExperiences", "NotEmpty", "Debes agregar al menos una experiencia laboral");
        }

        if (result.hasErrors()) {
            return "template_cv";
        }

        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            PersonalInfo personalInfo = new PersonalInfo();
            personalInfo.setFullName(cvRequest.getFullName());
            personalInfo.setEmail(cvRequest.getEmail());
            personalInfo.setPhone(cvRequest.getPhone());
            personalInfo.setAddress(cvRequest.getAddress());
            personalInfo.setLinkedin(cvRequest.getLinkedin());
            personalInfo.setPortfolio(cvRequest.getPortfolio());
            personalInfo.setProfession(cvRequest.getProfession());
            personalInfo.setSummary(cvRequest.getSummary());
            personalInfo.setTheme(cvRequest.getTheme());

            if (cvRequest.getProfileImageFile() != null && !cvRequest.getProfileImageFile().isEmpty()) {
                String fileName = imageService.saveImage(cvRequest.getProfileImageFile(), uploadDirectory);
                personalInfo.setProfileImagePath(fileName);
            }

            Summary summary = new Summary();
            summary.setUser(user);
            summary.setPersonalInfo(personalInfo);

            Summary savedSummary = summaryService.saveSummary(summary);

            // Guardar Technical Skills, Soft Skills, Educations, Work Experiences...

            redirectAttributes.addFlashAttribute("success", "¡Hoja de vida creada exitosamente!");
            return "redirect:/user/dashboard";

        } catch (DuplicateKeyException e) {
            // Mejorar el mensaje de error para ser más específico
            String errorMessage = "Error: ";
            if (e.getMessage().contains("email")) {
                errorMessage += "Ya existe un CV con este correo electrónico.";
            } else if (e.getMessage().contains("phone")) {
                errorMessage += "Ya existe un CV con este número de teléfono.";
            } else {
                errorMessage += "Ya existe un CV con información similar. Por favor, verifica los datos.";
            }

            redirectAttributes.addFlashAttribute("error", errorMessage);
            return "template_cv";
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al crear la hoja de vida: " + e.getMessage());
            return "template_cv";
        }
    }

    @GetMapping("/edit/{id}")
    public String showEditForm(@PathVariable Long id, Model model, Authentication authentication, RedirectAttributes redirectAttributes) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            Summary summary = summaryService.getSummaryByIdAndUserId(id, user.getId())
                    .orElseThrow(() -> new RuntimeException("CV no encontrado o no tienes permisos para editarlo"));

            CVRequest cvRequest = new CVRequest();
            PersonalInfo personalInfo = summary.getPersonalInfo();
            if (personalInfo != null) {
                cvRequest.setFullName(personalInfo.getFullName());
                cvRequest.setEmail(personalInfo.getEmail());
                cvRequest.setPhone(personalInfo.getPhone());
                cvRequest.setAddress(personalInfo.getAddress());
                cvRequest.setLinkedin(personalInfo.getLinkedin());
                cvRequest.setPortfolio(personalInfo.getPortfolio());
                cvRequest.setProfession(personalInfo.getProfession());
                cvRequest.setSummary(personalInfo.getSummary());
                cvRequest.setTheme(personalInfo.getTheme());
            }

            cvRequest.setTechnicalSkills(summary.getTechnicalSkills().stream().map(skill -> {
                TechnicalSkillRequest req = new TechnicalSkillRequest();
                req.setName(skill.getName());
                req.setCategory(skill.getCategory());
                return req;
            }).collect(Collectors.toList()));

            cvRequest.setSoftSkills(summary.getSoftSkills().stream().map(skill -> {
                SoftSkillRequest req = new SoftSkillRequest();
                req.setName(skill.getName());
                req.setDescription(skill.getDescription());
                return req;
            }).collect(Collectors.toList()));

            cvRequest.setEducations(summary.getEducations().stream().map(edu -> {
                EducationRequest req = new EducationRequest();
                req.setInstitution(edu.getInstitution());
                req.setDegree(edu.getDegree());
                req.setStudyLevel(edu.getStudyLevel());
                req.setStartDate(edu.getStartDate());
                req.setEndDate(edu.getEndDate());
                req.setCurrent(edu.getCurrent());
                req.setDescription(edu.getDescription());
                return req;
            }).collect(Collectors.toList()));

            cvRequest.setWorkExperiences(summary.getWorkExperiences().stream().map(exp -> {
                WorkExperienceRequest req = new WorkExperienceRequest();
                req.setPosition(exp.getPosition());
                req.setCompany(exp.getCompany());
                req.setStartDate(exp.getStartDate());
                req.setEndDate(exp.getEndDate());
                req.setDescription(exp.getDescription());
                return req;
            }).collect(Collectors.toList()));

            model.addAttribute("cvRequest", cvRequest);
            model.addAttribute("editMode", true);
            model.addAttribute("cvId", id);

            return "template_cv";

        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al cargar el CV para editar: " + e.getMessage());
            return "redirect:/user/dashboard";
        }
    }

    @PostMapping("/update/{id}")
    public String updateCV(@PathVariable Long id, @Valid @ModelAttribute("cvRequest") CVRequest cvRequest,
            BindingResult result,
            Authentication authentication,
            RedirectAttributes redirectAttributes) {

        if (cvRequest.getTechnicalSkills() == null || cvRequest.getTechnicalSkills().isEmpty()) {
            result.rejectValue("technicalSkills", "NotEmpty", "Debes agregar al menos una habilidad técnica");
        }
        if (cvRequest.getSoftSkills() == null || cvRequest.getSoftSkills().isEmpty()) {
            result.rejectValue("softSkills", "NotEmpty", "Debes agregar al menos una habilidad blanda");
        }
        if (cvRequest.getEducations() == null || cvRequest.getEducations().isEmpty()) {
            result.rejectValue("educations", "NotEmpty", "Debes agregar al menos una educación");
        }
        if (cvRequest.getWorkExperiences() == null || cvRequest.getWorkExperiences().isEmpty()) {
            result.rejectValue("workExperiences", "NotEmpty", "Debes agregar al menos una experiencia laboral");
        }

        if (result.hasErrors()) {
            redirectAttributes.addFlashAttribute("cvRequest", cvRequest);
            redirectAttributes.addFlashAttribute("editMode", true);
            redirectAttributes.addFlashAttribute("cvId", id);
            redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.cvRequest", result);
            return "redirect:/cv/edit/" + id;
        }

        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            CVUpdateRequest updateRequest = new CVUpdateRequest();
            updateRequest.setFullName(cvRequest.getFullName());
            updateRequest.setEmail(cvRequest.getEmail());
            updateRequest.setPhone(cvRequest.getPhone());
            updateRequest.setAddress(cvRequest.getAddress());
            updateRequest.setLinkedin(cvRequest.getLinkedin());
            updateRequest.setPortfolio(cvRequest.getPortfolio());
            updateRequest.setProfession(cvRequest.getProfession());
            updateRequest.setSummary(cvRequest.getSummary());
            updateRequest.setTheme(cvRequest.getTheme());
            updateRequest.setTechnicalSkills(cvRequest.getTechnicalSkills());
            updateRequest.setSoftSkills(cvRequest.getSoftSkills());
            updateRequest.setEducations(cvRequest.getEducations());
            updateRequest.setWorkExperiences(cvRequest.getWorkExperiences());

            summaryService.updateSummary(id, updateRequest, user);
            redirectAttributes.addFlashAttribute("success", "¡Hoja de vida actualizada exitosamente!");
            return "redirect:/user/dashboard";

        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al actualizar la hoja de vida: " + e.getMessage());
            return "redirect:/cv/edit/" + id;
        }
    }

    // Métodos para la sección de view CV
    @GetMapping("/view_cv")
    public String viewCv() {
        return "view_cv";
    }

    @GetMapping("/api/my-cvs")
    @ResponseBody
    public ResponseEntity<List<SummaryResponse>> getMyCVsApi(Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            List<Summary> summaries = summaryService.getSummariesByUser(user);

            List<SummaryResponse> response = summaries.stream()
                    .map(summaryService::convertToResponse)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Método para el botón de eliminar CV de my CV
    @DeleteMapping("/api/delete/{id}")
    @ResponseBody
    public ResponseEntity<?> deleteCVApi(@PathVariable Long id, Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            Optional<Summary> summary = summaryService.getSummaryByIdAndUserId(id, user.getId());
            if (summary.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("CV no encontrado o no tienes permisos");
            }

            summaryService.deleteSummary(id, user.getId());

            return ResponseEntity.ok().build();

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al eliminar el CV: " + e.getMessage());
        }
    }
    @GetMapping("/view/{id}")
    public String viewCvDetail(@PathVariable Long id, Model model, Authentication authentication) {
        String email = authentication.getName();
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Summary summary = summaryService.getSummaryByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("CV no encontrado o no tienes permisos"));

        SummaryResponse cv = summaryService.convertToResponse(summary);

        model.addAttribute("cv", cv);
        return "cv_detail";
    }
}