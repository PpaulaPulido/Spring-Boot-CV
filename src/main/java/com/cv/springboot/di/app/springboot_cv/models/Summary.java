package com.cv.springboot.di.app.springboot_cv.models;

import jakarta.persistence.*; // Importando las anotaciones de JPA para definir la entidad y sus relaciones
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "summaries")
public class Summary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Información personal embebida
    @Embedded
    private PersonalInfo personalInfo;

    // Habilidades técnicas
    @OneToMany(mappedBy = "summary", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TechnicalSkill> technicalSkills = new ArrayList<>();

    // Habilidades blandas
    @OneToMany(mappedBy = "summary", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SoftSkill> softSkills = new ArrayList<>();

    @OneToMany(mappedBy = "summary", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Education> educations = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public PersonalInfo getPersonalInfo() {
        return personalInfo;
    }

    public void setPersonalInfo(PersonalInfo personalInfo) {
        this.personalInfo = personalInfo;
    }

    public List<TechnicalSkill> getTechnicalSkills() {
        return technicalSkills;
    }

    public void setTechnicalSkills(List<TechnicalSkill> technicalSkills) {
        this.technicalSkills = technicalSkills;
    }

    public List<SoftSkill> getSoftSkills() {
        return softSkills;
    }

    public void setSoftSkills(List<SoftSkill> softSkills) {
        this.softSkills = softSkills;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public List<Education> getEducations() {
        return educations;
    }

    public void setEducations(List<Education> educations) {
        this.educations = educations;
    }

    public void addEducation(Education education) {
        this.educations.add(education);
        education.setSummary(this);
    }

    public void removeEducation(Education education) {
        this.educations.remove(education);
        education.setSummary(null);
    }

    public void clearEducations() {
        for (Education education : this.educations) {
            education.setSummary(null);
        }
        this.educations.clear();
    }

    // Metodos para manejar actualizacion
    public void updatePersonalInfo(PersonalInfo newInfo) {
        if (this.personalInfo == null) {
            this.personalInfo = newInfo;
        } else {
            if (newInfo.getFullName() != null)
                this.personalInfo.setFullName(newInfo.getFullName());
            if (newInfo.getEmail() != null)
                this.personalInfo.setEmail(newInfo.getEmail());
            if (newInfo.getPhone() != null)
                this.personalInfo.setPhone(newInfo.getPhone());
            if (newInfo.getAddress() != null)
                this.personalInfo.setAddress(newInfo.getAddress());
            if (newInfo.getLinkedin() != null)
                this.personalInfo.setLinkedin(newInfo.getLinkedin());
            if (newInfo.getPortfolio() != null)
                this.personalInfo.setPortfolio(newInfo.getPortfolio());
            if (newInfo.getProfession() != null)
                this.personalInfo.setProfession(newInfo.getProfession());
            if (newInfo.getSummary() != null)
                this.personalInfo.setSummary(newInfo.getSummary());
            if (newInfo.getProfileImagePath() != null)
                this.personalInfo.setProfileImagePath(newInfo.getProfileImagePath());
        }
    }

    public void clearTechnicalSkills() {
        // Primero desconectar las habilidades técnicas existentes
        for (TechnicalSkill skill : this.technicalSkills) {
            skill.setSummary(null);
        }
        this.technicalSkills.clear();
    }

    public void clearSoftSkills() {
        // Primero desconectar las habilidades blandas existentes
        for (SoftSkill skill : this.softSkills) {
            skill.setSummary(null);
        }
        this.softSkills.clear();
    }

    public void addTechnicalSkill(TechnicalSkill skill) {
        this.technicalSkills.add(skill);
        skill.setSummary(this);
    }

    public void addSoftSkill(SoftSkill skill) {
        this.softSkills.add(skill);
        skill.setSummary(this);
    }
}