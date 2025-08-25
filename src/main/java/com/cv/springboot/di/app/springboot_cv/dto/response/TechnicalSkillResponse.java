package com.cv.springboot.di.app.springboot_cv.dto.response;

public class TechnicalSkillResponse {
    private Long id;
    private String name;
    private String category;
    
    public TechnicalSkillResponse(Long id, String name, String category) {
        this.id = id;
        this.name = name;
        this.category = category;
    }
    
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getCategory() { return category; }
}