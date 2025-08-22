package com.cv.springboot.di.app.springboot_cv.controllers;

import com.cv.springboot.di.app.springboot_cv.dto.CVRequest;
import com.cv.springboot.di.app.springboot_cv.dto.TechnicalSkillRequest;
import com.cv.springboot.di.app.springboot_cv.dto.SoftSkillRequest;
import com.cv.springboot.di.app.springboot_cv.models.*;
import com.cv.springboot.di.app.springboot_cv.services.SummaryService;
import com.cv.springboot.di.app.springboot_cv.services.TechnicalSkillService;
import com.cv.springboot.di.app.springboot_cv.services.SoftSkillService;
import com.cv.springboot.di.app.springboot_cv.services.UserService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import java.util.List;

@Controller
@RequestMapping("/cv")
public class CVController {

    private final SummaryService summaryService;
    private final TechnicalSkillService technicalSkillService;
    private final SoftSkillService softSkillService;
    private final UserService userService;

    public CVController(SummaryService summaryService,
            TechnicalSkillService technicalSkillService,
            SoftSkillService softSkillService,
            UserService userService) {
        this.summaryService = summaryService;
        this.technicalSkillService = technicalSkillService;
        this.softSkillService = softSkillService;
        this.userService = userService;
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

        // Validaciones adicionales manuales si es necesario
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

            redirectAttributes.addFlashAttribute("success", "¡Hoja de vida creada exitosamente!");
            return "redirect:/user/dashboard";

        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al crear la hoja de vida: " + e.getMessage());
            return "redirect:/cv/templateCv";
        }
    }

    // @PostMapping("/create")
    // public String createCV(@RequestParam String fullName,
    // @RequestParam String email,
    // @RequestParam String phone,
    // @RequestParam(required = false) String address,
    // @RequestParam(required = false) String linkedin,
    // @RequestParam(required = false) String portfolio,
    // @RequestParam String profession,
    // @RequestParam(required = false) String summary,
    // @RequestParam(required = false) List<String> softSkillsNames,
    // @RequestParam(required = false) List<String> technicalSkillsNames,
    // @RequestParam(required = false) List<String> technicalSkillsCategories,
    // Authentication authentication,
    // RedirectAttributes redirectAttributes) {

    // try {
    // String userEmail = authentication.getName();
    // User user = userService.findByEmail(userEmail)
    // .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

    // // Crear PersonalInfo
    // PersonalInfo personalInfo = new PersonalInfo();
    // personalInfo.setFullName(fullName);
    // personalInfo.setEmail(email);
    // personalInfo.setPhone(phone);
    // personalInfo.setAddress(address);
    // personalInfo.setLinkedin(linkedin);
    // personalInfo.setPortfolio(portfolio);
    // personalInfo.setProfession(profession);
    // personalInfo.setSummary(summary);

    // // Crear y guardar Summary
    // Summary summaryObj = new Summary();
    // summaryObj.setUser(user);
    // summaryObj.setPersonalInfo(personalInfo);
    // Summary savedSummary = summaryService.saveSummary(summaryObj);

    // // Guardar Soft Skills
    // if (softSkillsNames != null) {
    // for (String skillName : softSkillsNames) {
    // SoftSkill softSkill = new SoftSkill();
    // softSkill.setSummary(savedSummary);
    // softSkill.setName(skillName);
    // softSkillService.saveSoftSkill(softSkill);
    // }
    // }

    // // Guardar Technical Skills
    // if (technicalSkillsNames != null) {
    // for (int i = 0; i < technicalSkillsNames.size(); i++) {
    // TechnicalSkill technicalSkill = new TechnicalSkill();
    // technicalSkill.setSummary(savedSummary);
    // technicalSkill.setName(technicalSkillsNames.get(i));
    // technicalSkill.setCategory(
    // technicalSkillsCategories != null && i < technicalSkillsCategories.size()
    // ? technicalSkillsCategories.get(i)
    // : "General");
    // technicalSkillService.saveTechnicalSkill(technicalSkill);
    // }
    // }

    // redirectAttributes.addFlashAttribute("success", "¡Hoja de vida creada
    // exitosamente!");
    // return "redirect:/user/dashboard";

    // } catch (Exception e) {
    // redirectAttributes.addFlashAttribute("error", "Error al crear la hoja de
    // vida");
    // return "redirect:/cv/templateCv";
    // }
    // }

    @GetMapping("/my-cvs")
    public String listMyCVs(Model model, Authentication authentication) {
        String email = authentication.getName();
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        List<Summary> summaries = summaryService.getSummariesByUser(user);
        model.addAttribute("summaries", summaries);
        return "my_cvs";
    }
}