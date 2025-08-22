package com.cv.springboot.di.app.springboot_cv.models;

import jakarta.persistence.*;
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
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public PersonalInfo getPersonalInfo() { return personalInfo; }
    public void setPersonalInfo(PersonalInfo personalInfo) { this.personalInfo = personalInfo; }

    public List<TechnicalSkill> getTechnicalSkills() { return technicalSkills; }
    public void setTechnicalSkills(List<TechnicalSkill> technicalSkills) { this.technicalSkills = technicalSkills; }

    public List<SoftSkill> getSoftSkills() { return softSkills; }
    public void setSoftSkills(List<SoftSkill> softSkills) { this.softSkills = softSkills; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}