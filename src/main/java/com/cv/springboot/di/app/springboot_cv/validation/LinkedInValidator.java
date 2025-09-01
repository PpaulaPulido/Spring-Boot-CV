package com.cv.springboot.di.app.springboot_cv.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.regex.Pattern;

public class LinkedInValidator implements ConstraintValidator<ValidLinkedIn, String> {

    private static final String LINKEDIN_PATTERN = "^(?i)https?://(www\\.)?linkedin\\.com/in/[a-zA-Z0-9\\-_]{5,}/?$";

    @Override
    public void initialize(ValidLinkedIn constraintAnnotation) {
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.trim().isEmpty()) {
            return true; // Not required field
        }
        return Pattern.matches(LINKEDIN_PATTERN, value);
    }
}