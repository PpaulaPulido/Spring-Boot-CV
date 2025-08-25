package com.cv.springboot.di.app.springboot_cv.dto.response;

public class SoftSkillResponse {
    private Long id;
    private String name;
    private String description;
    
    public SoftSkillResponse(Long id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
    
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
}