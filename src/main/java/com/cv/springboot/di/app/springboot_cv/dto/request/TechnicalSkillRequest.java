package com.cv.springboot.di.app.springboot_cv.dto.request;

import com.cv.springboot.di.app.springboot_cv.validation.ValidSkillCategory;
import com.cv.springboot.di.app.springboot_cv.validation.ValidSkillName;
import jakarta.validation.constraints.NotBlank;

public class TechnicalSkillRequest {

    private Long id;
    @NotBlank(message = "El nombre de la habilidad técnica es obligatorio")
    @ValidSkillName
    private String name;
    @ValidSkillCategory
    private String category;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Long getId() {return id;}
    public void setId(Long id) {this.id = id;}
}