package com.cv.springboot.di.app.springboot_cv.models;

import jakarta.persistence.*;// Importando las anotaciones de JPA para definir la entidad y sus relaciones

@Entity
@Table(name = "soft_skills")
public class SoftSkill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "summary_id", nullable = false)
    private Summary summary;

    private String name; 
    private String description; 

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Summary getSummary() { return summary; }
    public void setSummary(Summary summary) { this.summary = summary; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

}