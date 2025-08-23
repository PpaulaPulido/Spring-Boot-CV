package com.cv.springboot.di.app.springboot_cv.models;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.time.YearMonth;

@Entity
@Table(name = "educations")
public class Education {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String institution;

    @Column(nullable = false)
    private String degree;

    private String studyLevel;

    @Column(name = "start_year")
    private Integer startYear;

    @Column(name = "start_month")
    private Integer startMonth;

    @Column(name = "end_year")
    private Integer endYear;

    @Column(name = "end_month")
    private Integer endMonth;

    private Boolean current = false;

    @Column(length = 1000)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "summary_id", nullable = false)
    private Summary summary;

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

    public Education() {
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getInstitution() {
        return institution;
    }

    public void setInstitution(String institution) {
        this.institution = institution;
    }

    public String getDegree() {
        return degree;
    }

    public void setDegree(String degree) {
        this.degree = degree;
    }

    public String getStudyLevel() {
        return studyLevel;
    }

    public void setStudyLevel(String studyLevel) {
        this.studyLevel = studyLevel;
    }

    public Integer getStartYear() {
        return startYear;
    }

    public void setStartYear(Integer startYear) {
        this.startYear = startYear;
    }

    public Integer getStartMonth() {
        return startMonth;
    }

    public void setStartMonth(Integer startMonth) {
        this.startMonth = startMonth;
    }

    public Integer getEndYear() {
        return endYear;
    }

    public void setEndYear(Integer endYear) {
        this.endYear = endYear;
    }

    public Integer getEndMonth() {
        return endMonth;
    }

    public void setEndMonth(Integer endMonth) {
        this.endMonth = endMonth;
    }

    public Boolean getCurrent() {
        return current;
    }

    public void setCurrent(Boolean current) {
        this.current = current;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Summary getSummary() {
        return summary;
    }

    public void setSummary(Summary summary) {
        this.summary = summary;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    // Métodos para manejar YearMonth
    public YearMonth getStartDate() {
        return startYear != null && startMonth != null ? YearMonth.of(startYear, startMonth) : null;
    }

    public void setStartDate(YearMonth startDate) {
        this.startYear = startDate != null ? startDate.getYear() : null;
        this.startMonth = startDate != null ? startDate.getMonthValue() : null;
    }

    public YearMonth getEndDate() {
        return endYear != null && endMonth != null ? YearMonth.of(endYear, endMonth) : null;
    }

    public void setEndDate(YearMonth endDate) {
        this.endYear = endDate != null ? endDate.getYear() : null;
        this.endMonth = endDate != null ? endDate.getMonthValue() : null;
    }

    // Método para mostrar la fecha formateada
    public String getFormattedPeriod() {
        if (Boolean.TRUE.equals(current)) {
            return formatYearMonth(getStartDate()) + " - Actualidad";
        }
        return formatYearMonth(getStartDate()) + " - " + formatYearMonth(getEndDate());
    }

    private String formatYearMonth(YearMonth yearMonth) {
        if (yearMonth == null)
            return "Fecha no especificada";

        String[] months = { "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" };

        int monthIndex = yearMonth.getMonthValue() - 1;
        String monthName = (monthIndex >= 0 && monthIndex < months.length) ? months[monthIndex]
                : String.valueOf(yearMonth.getMonthValue());

        return monthName + " " + yearMonth.getYear();
    }

    // Método adicional para validación
    public boolean isValid() {
        return institution != null && !institution.trim().isEmpty() &&
                degree != null && !degree.trim().isEmpty() &&
                getStartDate() != null;
    }
}