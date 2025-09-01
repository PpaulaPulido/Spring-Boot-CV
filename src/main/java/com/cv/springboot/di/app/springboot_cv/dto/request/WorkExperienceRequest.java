package com.cv.springboot.di.app.springboot_cv.dto.request;

import com.cv.springboot.di.app.springboot_cv.validation.ValidEntityName;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import java.time.YearMonth;

import com.cv.springboot.di.app.springboot_cv.validation.ValidDateRange;

@ValidDateRange
public class WorkExperienceRequest {
    
    @NotBlank(message = "El puesto es obligatorio")
    @ValidEntityName(message = "El nombre del puesto no es válido")
    private String position;
    
    @NotBlank(message = "La empresa es obligatoria")
    @ValidEntityName(message = "El nombre de la empresa no es válido")
    private String company;
    
    @NotNull(message = "La fecha de inicio es obligatoria")
    private YearMonth startDate;
    
    private YearMonth endDate;
    
    private Boolean current = false;
    
    private String description;

    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public YearMonth getStartDate() { return startDate; }
    public void setStartDate(YearMonth startDate) { this.startDate = startDate; }

    public YearMonth getEndDate() { return endDate; }
    public void setEndDate(YearMonth endDate) { this.endDate = endDate; }

    public Boolean getCurrent() { return current; }
    public void setCurrent(Boolean current) { this.current = current; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}