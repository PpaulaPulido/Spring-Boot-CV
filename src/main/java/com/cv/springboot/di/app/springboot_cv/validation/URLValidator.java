package com.cv.springboot.di.app.springboot_cv.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.net.URL;

public class URLValidator implements ConstraintValidator<ValidURL, String> {

    @Override
    public void initialize(ValidURL constraintAnnotation) {
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.trim().isEmpty()) {
            return true; // Not required field
        }
        try {
            new URL(value).toURI();
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}