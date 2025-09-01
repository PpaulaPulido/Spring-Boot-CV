package com.cv.springboot.di.app.springboot_cv.dto.request;

import com.cv.springboot.di.app.springboot_cv.validation.ValidSkillName;
import jakarta.validation.constraints.NotBlank;

public class SoftSkillRequest {
    
    private Long id;
    @NotBlank(message = "El nombre de la habilidad blanda es obligatorio")
    @ValidSkillName
    private String name;
    private String description;

    public Long getId(){ return id;}
    public void setId(Long id) {this.id = id;}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}