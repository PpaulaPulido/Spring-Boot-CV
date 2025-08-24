package com.cv.springboot.di.app.springboot_cv.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.YearMonth;

@Entity
@Table(name = "work_experiences")
public class WorkExperience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String position; // Puesto

    @Column(nullable = false)
    private String company; // Empresa

    @Column(name = "start_year")
    private Integer startYear;

    @Column(name = "start_month") 
    private Integer startMonth;

    @Column(name = "end_year")
    private Integer endYear;

    @Column(name = "end_month")
    private Integer endMonth;

    @Column(length = 1000)
    private String description; // Descripción

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "summary_id", nullable = false)
    private Summary summary;

    // Constructor vacío
    public WorkExperience() {}

    // Constructor con parámetros
    public WorkExperience(String position, String company, YearMonth startDate, YearMonth endDate,String description) {
        this.position = position;
        this.company = company;
        setStartDate(startDate);
        setEndDate(endDate);
        this.description = description;
    }

    // Métodos para manejar YearMonth
    public YearMonth getStartDate() {
        return startYear != null && startMonth != null ? 
               YearMonth.of(startYear, startMonth) : null;
    }

    public void setStartDate(YearMonth startDate) {
        this.startYear = startDate != null ? startDate.getYear() : null;
        this.startMonth = startDate != null ? startDate.getMonthValue() : null;
    }

    public YearMonth getEndDate() {
        return endYear != null && endMonth != null ? 
               YearMonth.of(endYear, endMonth) : null;
    }

    public void setEndDate(YearMonth endDate) {
        this.endYear = endDate != null ? endDate.getYear() : null;
        this.endMonth = endDate != null ? endDate.getMonthValue() : null;
    }

    // Método para mostrar el período formateado
    public String getFormattedPeriod() {
        return formatYearMonth(getStartDate()) + " - " + formatYearMonth(getEndDate());
    }

    private String formatYearMonth(YearMonth yearMonth) {
        if (yearMonth == null) return "Fecha no especificada";
        
        String[] months = {"Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                          "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"};
        
        int monthIndex = yearMonth.getMonthValue() - 1;
        String monthName = (monthIndex >= 0 && monthIndex < months.length) ? 
                          months[monthIndex] : String.valueOf(yearMonth.getMonthValue());
        
        return monthName + " " + yearMonth.getYear();
    }

    // Validación básica
    public boolean isValid() {
        return position != null && !position.trim().isEmpty() &&
               company != null && !company.trim().isEmpty() &&
               getStartDate() != null;
    }

    // PrePersist y PreUpdate
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

    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public Integer getStartYear() { return startYear; }
    public void setStartYear(Integer startYear) { this.startYear = startYear; }

    public Integer getStartMonth() { return startMonth; }
    public void setStartMonth(Integer startMonth) { this.startMonth = startMonth; }

    public Integer getEndYear() { return endYear; }
    public void setEndYear(Integer endYear) { this.endYear = endYear; }

    public Integer getEndMonth() { return endMonth; }
    public void setEndMonth(Integer endMonth) { this.endMonth = endMonth; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public Summary getSummary() { return summary; }
    public void setSummary(Summary summary) { this.summary = summary; }
}