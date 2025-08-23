package com.cv.springboot.di.app.springboot_cv.controllers;

import com.cv.springboot.di.app.springboot_cv.dto.CVRequest;
import com.cv.springboot.di.app.springboot_cv.dto.CVUpdateRequest;
import com.cv.springboot.di.app.springboot_cv.dto.EducationRequest;
import com.cv.springboot.di.app.springboot_cv.dto.TechnicalSkillRequest;
import com.cv.springboot.di.app.springboot_cv.dto.SoftSkillRequest;
import com.cv.springboot.di.app.springboot_cv.models.*;
import com.cv.springboot.di.app.springboot_cv.services.SummaryService;
import com.cv.springboot.di.app.springboot_cv.services.TechnicalSkillService;
import com.cv.springboot.di.app.springboot_cv.services.SoftSkillService;
import com.cv.springboot.di.app.springboot_cv.services.UserService;
import com.cv.springboot.di.app.springboot_cv.services.EducationService;
import com.cv.springboot.di.app.springboot_cv.services.ImageService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Collectors;

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
            ImageService imageService,
            EducationService educationService) {
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

    // En el método updateSummary del servicio, agrega:
    // summaryService.updateEducations(existingSummary, updateRequest.getEducations());

    // En el método convertSummaryToUpdateRequest, agrega:
    // Convertir educations
    // List<EducationRequest> educationRequests = summary.getEducations().stream()
    //         .map(education -> {
    //             EducationRequest er = new EducationRequest();
    //             er.setId(education.getId());
    //             er.setInstitution(education.getInstitution());
    //             er.setDegree(education.getDegree());
    //             er.setStudyLevel(education.getStudyLevel());
    //             er.setStartDate(education.getStartDate());
    //             er.setEndDate(education.getEndDate());
    //             er.setCurrent(education.getCurrent());
    //             er.setDescription(education.getDescription());
    //             return er;
    //         })
    //         .collect(Collectors.toList());
    // request.setEducations(educationRequests);

    // @GetMapping("/edit/{id}")
    // public String showEditForm(@PathVariable Long id, Model model, Authentication
    // authentication) {
    // try {
    // String email = authentication.getName();
    // User user = userService.findByEmail(email)
    // .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

    // Summary summary = summaryService.getSummaryByIdAndUserId(id, user.getId())
    // .orElseThrow(() -> new RuntimeException("CV no encontrado"));

    // // Convertir Summary a CVUpdateRequest para prellenar el formulario
    // CVUpdateRequest cvUpdateRequest = convertSummaryToUpdateRequest(summary);
    // cvUpdateRequest.setSummaryId(id);

    // model.addAttribute("cvUpdateRequest", cvUpdateRequest);
    // model.addAttribute("summaryId", id);
    // return "edit_cv";

    // } catch (Exception e) {
    // return "redirect:/cv/my-cvs?error=CV+no+encontrado";
    // }
    // }

    // @PostMapping("/update/{id}")
    // public String updateCV(@PathVariable Long id,
    // @Valid @ModelAttribute("cvUpdateRequest") CVUpdateRequest cvUpdateRequest,
    // BindingResult result,
    // Authentication authentication,
    // RedirectAttributes redirectAttributes) {

    // if (result.hasErrors()) {
    // return "edit_cv";
    // }

    // try {
    // String email = authentication.getName();
    // User user = userService.findByEmail(email)
    // .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

    // // Procesar nueva imagen si se subió
    // if (cvUpdateRequest.getProfileImageFile() != null &&
    // !cvUpdateRequest.getProfileImageFile().isEmpty()) {
    // try {
    // String fileName =
    // imageService.saveImage(cvUpdateRequest.getProfileImageFile(),
    // uploadDirectory);

    // // Obtener el summary actual para eliminar la imagen anterior si existe
    // Summary currentSummary = summaryService.getSummaryByIdAndUserId(id,
    // user.getId())
    // .orElseThrow(() -> new RuntimeException("Summary no encontrado"));

    // if (currentSummary.getPersonalInfo().getProfileImagePath() != null) {
    // imageService.deleteImage(currentSummary.getPersonalInfo().getProfileImagePath(),
    // uploadDirectory);
    // }

    // // Crear PersonalInfo con la nueva imagen
    // PersonalInfo personalInfo = new PersonalInfo();
    // personalInfo.setProfileImagePath(fileName);
    // // Actualizar solo la imagen en el summary
    // currentSummary.getPersonalInfo().setProfileImagePath(fileName);
    // summaryService.saveSummary(currentSummary);

    // } catch (IOException e) {
    // redirectAttributes.addFlashAttribute("error", "Error al subir la imagen: " +
    // e.getMessage());
    // return "redirect:/cv/edit/" + id;
    // }
    // }

    // // Actualizar el summary completo
    // Summary updatedSummary = summaryService.updateSummary(id, cvUpdateRequest,
    // user);

    // redirectAttributes.addFlashAttribute("success", "¡Hoja de vida actualizada
    // exitosamente!");
    // return "redirect:/cv/my-cvs";

    // } catch (Exception e) {
    // redirectAttributes.addFlashAttribute("error", "Error al actualizar: " +
    // e.getMessage());
    // return "redirect:/cv/edit/" + id;
    // }
    // }

    // @PostMapping("/delete/{id}")
    // public String deleteCV(@PathVariable Long id, Authentication authentication,
    // RedirectAttributes redirectAttributes) {
    // try {
    // String email = authentication.getName();
    // User user = userService.findByEmail(email)
    // .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

    // // Eliminar imagen de perfil si existe
    // Summary summary = summaryService.getSummaryByIdAndUserId(id, user.getId())
    // .orElseThrow(() -> new RuntimeException("Summary no encontrado"));

    // if (summary.getPersonalInfo().getProfileImagePath() != null) {
    // imageService.deleteImage(summary.getPersonalInfo().getProfileImagePath(),
    // uploadDirectory);
    // }

    // summaryService.deleteSummary(id, user.getId());

    // redirectAttributes.addFlashAttribute("success", "¡Hoja de vida eliminada
    // exitosamente!");
    // return "redirect:/cv/my-cvs";

    // } catch (Exception e) {
    // redirectAttributes.addFlashAttribute("error", "Error al eliminar: " +
    // e.getMessage());
    // return "redirect:/cv/my-cvs";
    // }
    // }

    // // Método helper para convertir Summary a CVUpdateRequest
    // private CVUpdateRequest convertSummaryToUpdateRequest(Summary summary) {
    // CVUpdateRequest request = new CVUpdateRequest();
    // PersonalInfo info = summary.getPersonalInfo();

    // request.setFullName(info.getFullName());
    // request.setEmail(info.getEmail());
    // request.setPhone(info.getPhone());
    // request.setAddress(info.getAddress());
    // request.setLinkedin(info.getLinkedin());
    // request.setPortfolio(info.getPortfolio());
    // request.setProfession(info.getProfession());
    // request.setSummary(info.getSummary());
    // request.setSummaryId(summary.getId());

    // // Convertir technical skills
    // List<TechnicalSkillRequest> techSkills =
    // summary.getTechnicalSkills().stream()
    // .map(skill -> {
    // TechnicalSkillRequest tsr = new TechnicalSkillRequest();
    // tsr.setName(skill.getName());
    // tsr.setCategory(skill.getCategory());
    // return tsr;
    // })
    // .collect(Collectors.toList());
    // request.setTechnicalSkills(techSkills);

    // // Convertir soft skills
    // List<SoftSkillRequest> softSkills = summary.getSoftSkills().stream()
    // .map(skill -> {
    // SoftSkillRequest ssr = new SoftSkillRequest();
    // ssr.setName(skill.getName());
    // ssr.setDescription(skill.getDescription());
    // return ssr;
    // })
    // .collect(Collectors.toList());
    // request.setSoftSkills(softSkills);

    // return request;
    // }


    
}