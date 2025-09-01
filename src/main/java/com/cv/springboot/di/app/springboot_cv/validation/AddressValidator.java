package com.cv.springboot.di.app.springboot_cv.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.regex.Pattern;

public class AddressValidator implements ConstraintValidator<ValidAddress, String> {

    private static final String ADDRESS_PATTERN = "^[a-zA-ZÀ-ÿ0-9,.\\-\\#\\/][a-zA-ZÀ-ÿ0-9\\s,.\\-\\#\\/]{8,148}[a-zA-ZÀ-ÿ0-9,.\\-\\#\\/]$";

    @Override
    public void initialize(ValidAddress constraintAnnotation) {
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.trim().isEmpty()) {
            return true; // Not required field
        }
        return Pattern.matches(ADDRESS_PATTERN, value);
    }
}
