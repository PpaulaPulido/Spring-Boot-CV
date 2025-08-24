package com.cv.springboot.di.app.springboot_cv.controllers;

import com.cv.springboot.di.app.springboot_cv.dto.request.CVRequest;
import com.cv.springboot.di.app.springboot_cv.dto.request.CVUpdateRequest;
import com.cv.springboot.di.app.springboot_cv.dto.request.EducationRequest;
import com.cv.springboot.di.app.springboot_cv.dto.request.SoftSkillRequest;
import com.cv.springboot.di.app.springboot_cv.dto.request.TechnicalSkillRequest;
import com.cv.springboot.di.app.springboot_cv.dto.response.SummaryResponse;
import com.cv.springboot.di.app.springboot_cv.models.*;
import com.cv.springboot.di.app.springboot_cv.services.SummaryService;
import com.cv.springboot.di.app.springboot_cv.services.TechnicalSkillService;
import com.cv.springboot.di.app.springboot_cv.services.SoftSkillService;
import com.cv.springboot.di.app.springboot_cv.services.UserService;
import com.cv.springboot.di.app.springboot_cv.services.EducationService;
import com.cv.springboot.di.app.springboot_cv.services.ImageService;
import jakarta.validation.Valid; // activar validación de datos
import org.springframework.security.core.Authentication; //info del usuario autenticado
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.beans.factory.annotation.Value; // para inyectar propiedades de configuración
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.servlet.mvc.support.RedirectAttributes; // para redirección y mensajes flash
import java.io.IOException; //para capturar excepciones de entrada y salida de datos
import java.util.List;
import java.util.stream.Collectors; //Permite acumular elementos en una coleccion de datos
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

    @Value("${app.upload.dir:uploads/images/}")
    private String uploadDirectory;

    public CVController(SummaryService summaryService,
            TechnicalSkillService technicalSkillService,
            SoftSkillService softSkillService,
            UserService userService,
            EducationService educationService,
            ImageService imageService) {
        this.summaryService = summaryService;
        this.technicalSkillService = technicalSkillService;
        this.softSkillService = softSkillService;
        this.userService = userService;
        this.imageService = imageService;
        this.educationService = educationService;
    }

    @GetMapping("/templateCv")
    public String showCVTemplateForm(Model model, Authentication authentication) {
        CVRequest cvRequest = new CVRequest();
        model.addAttribute("cvRequest", cvRequest);
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

        if (result.hasErrors()) {
            // Log para debugging
            result.getAllErrors().forEach(error -> System.out.println("Error: " + error.getDefaultMessage()));
            return "template_cv";
        }

        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            // Crear PersonalInfo
            PersonalInfo personalInfo = new PersonalInfo();
            personalInfo.setFullName(cvRequest.getFullName());
            personalInfo.setEmail(cvRequest.getEmail());
            personalInfo.setPhone(cvRequest.getPhone());
            personalInfo.setAddress(cvRequest.getAddress());
            personalInfo.setLinkedin(cvRequest.getLinkedin());
            personalInfo.setPortfolio(cvRequest.getPortfolio());
            personalInfo.setProfession(cvRequest.getProfession());
            personalInfo.setSummary(cvRequest.getSummary());

            // Procesar la imagen si se subió
            if (cvRequest.getProfileImageFile() != null && !cvRequest.getProfileImageFile().isEmpty()) {
                try {
                    String fileName = imageService.saveImage(cvRequest.getProfileImageFile(), uploadDirectory);
                    personalInfo.setProfileImagePath(fileName);
                } catch (IOException e) {
                    redirectAttributes.addFlashAttribute("error", "Error al subir la imagen: " + e.getMessage());
                    return "redirect:/cv/templateCv";
                } catch (IllegalArgumentException e) {
                    redirectAttributes.addFlashAttribute("error", e.getMessage());
                    return "redirect:/cv/templateCv";
                }
            }

            // Crear Summary
            Summary summary = new Summary();
            summary.setUser(user);
            summary.setPersonalInfo(personalInfo);

            // Guardar Summary primero
            Summary savedSummary = summaryService.saveSummary(summary);

            // Guardar Technical Skills
            if (cvRequest.getTechnicalSkills() != null) {
                for (TechnicalSkillRequest techSkillRequest : cvRequest.getTechnicalSkills()) {
                    TechnicalSkill technicalSkill = new TechnicalSkill();
                    technicalSkill.setSummary(savedSummary);
                    technicalSkill.setName(techSkillRequest.getName());
                    technicalSkill.setCategory(
                            techSkillRequest.getCategory() != null && !techSkillRequest.getCategory().isEmpty()
                                    ? techSkillRequest.getCategory()
                                    : "General");
                    technicalSkillService.saveTechnicalSkill(technicalSkill);
                }
            }

            // Guardar Soft Skills
            if (cvRequest.getSoftSkills() != null) {
                for (SoftSkillRequest softSkillRequest : cvRequest.getSoftSkills()) {
                    SoftSkill softSkill = new SoftSkill();
                    softSkill.setSummary(savedSummary);
                    softSkill.setName(softSkillRequest.getName());
                    softSkill.setDescription(softSkillRequest.getDescription());
                    softSkillService.saveSoftSkill(softSkill);
                }
            }

            if (cvRequest.getEducations() != null) {
                for (EducationRequest educationRequest : cvRequest.getEducations()) {
                    Education education = new Education();
                    education.setSummary(savedSummary);
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
                    educationService.saveEducation(education);
                }
            }

            redirectAttributes.addFlashAttribute("success", "¡Hoja de vida creada exitosamente!");
            return "redirect:/user/dashboard";

        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al crear la hoja de vida: " + e.getMessage());
            return "redirect:/cv/templateCv";
        }
    }

    //Metodos para la seccion de view CV
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

    //metodo para el boton de eliminar CV de my CV
    @DeleteMapping("/api/delete/{id}")
    @ResponseBody
    public ResponseEntity<?> deleteCVApi(@PathVariable Long id, Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            // Verificar que el CV existe y pertenece al usuario
            Optional<Summary> summary = summaryService.getSummaryByIdAndUserId(id, user.getId());
            if (summary.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("CV no encontrado o no tienes permisos");
            }

            // Usar el método que verifica el usuario
            summaryService.deleteSummary(id, user.getId());

            return ResponseEntity.ok().build();

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al eliminar el CV: " + e.getMessage());
        }
    }

}