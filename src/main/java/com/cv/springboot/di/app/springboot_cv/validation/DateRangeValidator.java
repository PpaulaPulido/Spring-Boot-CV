package com.cv.springboot.di.app.springboot_cv.validation;

import com.cv.springboot.di.app.springboot_cv.dto.request.EducationRequest;
import com.cv.springboot.di.app.springboot_cv.dto.request.WorkExperienceRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.time.YearMonth;

public class DateRangeValidator implements ConstraintValidator<ValidDateRange, Object> {

    @Override
    public void initialize(ValidDateRange constraintAnnotation) {
    }

    @Override
    public boolean isValid(Object obj, ConstraintValidatorContext context) {
        if (obj == null) {
            return true;
        }

        YearMonth startDate = null;
        YearMonth endDate = null;
        Boolean current = false;

        if (obj instanceof EducationRequest) {
            EducationRequest request = (EducationRequest) obj;
            startDate = request.getStartDate();
            endDate = request.getEndDate();
            current = request.getCurrent();
        } else if (obj instanceof WorkExperienceRequest) {
            WorkExperienceRequest request = (WorkExperienceRequest) obj;
            startDate = request.getStartDate();
            endDate = request.getEndDate();
            current = request.getCurrent();
        } else {
            // Should not happen if annotation is applied correctly
            return true;
        }

        // If it's current, endDate is not relevant for this validation
        if (current != null && current) {
            return true;
        }

        // If both dates are null, or only startDate is null, it's valid (other annotations handle NotNull)
        if (startDate == null) {
            return true;
        }

        // If endDate is null and not current, it's valid (it means it's an ongoing period not marked as current)
        if (endDate == null) {
            return true;
        }

        // Compare dates
        return !endDate.isBefore(startDate);
    }
}
