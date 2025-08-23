package com.cv.springboot.di.app.springboot_cv.controllers;

import com.cv.springboot.di.app.springboot_cv.dto.EducationRequest;
import com.cv.springboot.di.app.springboot_cv.models.Education;
import com.cv.springboot.di.app.springboot_cv.models.Summary;
import com.cv.springboot.di.app.springboot_cv.models.User;
import com.cv.springboot.di.app.springboot_cv.services.EducationService;
import com.cv.springboot.di.app.springboot_cv.services.SummaryService;
import com.cv.springboot.di.app.springboot_cv.services.UserService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.Optional;

@Controller
@RequestMapping("/education")
public class EducationController {
    
    private final EducationService educationService;
    private final SummaryService summaryService;
    private final UserService userService;
    
    public EducationController(EducationService educationService, 
                              SummaryService summaryService, 
                              UserService userService) {
        this.educationService = educationService;
        this.summaryService = summaryService;
        this.userService = userService;
    }
    
    // Formulario para agregar/editar educación
    @GetMapping("/{summaryId}/form")
    public String showEducationForm(@PathVariable Long summaryId,
                                   @RequestParam(required = false) Long educationId,
                                   Model model,
                                   Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            // Verificar que el summary pertenezca al usuario
            Optional<Summary> summary = summaryService.getSummaryByIdAndUserId(summaryId, user.getId());
            if (summary.isEmpty()) {
                return "redirect:/cv/my-cvs?error=Summary+no+encontrado";
            }
            
            EducationRequest educationRequest = new EducationRequest();
            
            if (educationId != null) {
                // Modo edición
                Optional<Education> education = educationService.getEducationByIdAndSummaryId(educationId, summaryId);
                if (education.isPresent()) {
                    educationRequest.setId(education.get().getId());
                    educationRequest.setInstitution(education.get().getInstitution());
                    educationRequest.setDegree(education.get().getDegree());
                    educationRequest.setStudyLevel(education.get().getStudyLevel());
                    educationRequest.setStartDate(education.get().getStartDate());
                    educationRequest.setEndDate(education.get().getEndDate());
                    educationRequest.setCurrent(education.get().getCurrent());
                    educationRequest.setDescription(education.get().getDescription());
                }
            }
            
            model.addAttribute("educationRequest", educationRequest);
            model.addAttribute("summaryId", summaryId);
            return "education_form";
            
        } catch (Exception e) {
            return "redirect:/cv/my-cvs?error=" + e.getMessage();
        }
    }
    
    // Guardar o actualizar educación
    @PostMapping("/{summaryId}/save")
    public String saveEducation(@PathVariable Long summaryId,
                               @Valid @ModelAttribute("educationRequest") EducationRequest educationRequest,
                               BindingResult result,
                               Authentication authentication,
                               RedirectAttributes redirectAttributes) {
        
        if (result.hasErrors()) {
            return "education_form";
        }
        
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            // Verificar que el summary pertenezca al usuario
            Summary summary = summaryService.getSummaryByIdAndUserId(summaryId, user.getId())
                    .orElseThrow(() -> new RuntimeException("Summary no encontrado"));
            
            Education education;
            
            if (educationRequest.getId() != null) {
                // Actualizar educación existente
                education = educationService.getEducationByIdAndSummaryId(educationRequest.getId(), summaryId)
                        .orElseThrow(() -> new RuntimeException("Educación no encontrada"));
            } else {
                // Nueva educación
                education = new Education();
                education.setSummary(summary);
            }
            
            // Actualizar datos
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
            
            redirectAttributes.addFlashAttribute("success", 
                educationRequest.getId() != null ? "¡Educación actualizada!" : "¡Educación agregada!");
            return "redirect:/cv/edit/" + summaryId;
            
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error: " + e.getMessage());
            return "redirect:/education/" + summaryId + "/form";
        }
    }
    
    // Eliminar educación
    @PostMapping("/{summaryId}/delete/{educationId}")
    public String deleteEducation(@PathVariable Long summaryId,
                                 @PathVariable Long educationId,
                                 Authentication authentication,
                                 RedirectAttributes redirectAttributes) {
        
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            // Verificar que la educación pertenezca al usuario
            boolean deleted = educationService.deleteEducation(educationId, summaryId);
            
            if (deleted) {
                redirectAttributes.addFlashAttribute("success", "¡Educación eliminada!");
            } else {
                redirectAttributes.addFlashAttribute("error", "Educación no encontrada");
            }
            
            return "redirect:/cv/edit/" + summaryId;
            
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al eliminar: " + e.getMessage());
            return "redirect:/cv/edit/" + summaryId;
        }
    }
}