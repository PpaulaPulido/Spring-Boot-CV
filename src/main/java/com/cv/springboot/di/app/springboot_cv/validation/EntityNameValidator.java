package com.cv.springboot.di.app.springboot_cv.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.regex.Pattern;

public class EntityNameValidator implements ConstraintValidator<ValidEntityName, String> {

    @Override
    public void initialize(ValidEntityName constraintAnnotation) {
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.trim().isEmpty()) {
            return true; // @NotBlank
        }

        String valor = value.trim();

        if (valor.length() < 2 || valor.length() > 255) {
            return false;
        }

        if (Pattern.compile("(.)\\1{3,}").matcher(valor).find()) {
            return false;
        }

        if (!Pattern.compile("[aeiouáéíóú]", Pattern.CASE_INSENSITIVE).matcher(valor).find()) {
            return false;
        }

        if (!Pattern.matches("^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s-.,()&]+$", valor)) {
            return false;
        }

        if (ValidationUtils.isKeyboardPattern(valor) || ValidationUtils.isSequential(valor)) {
            return false;
        }

        if (Pattern.compile("[bcdfghjklmnpqrstvwxyzñ]{5,}", Pattern.CASE_INSENSITIVE).matcher(valor.replaceAll("\\s", "")).find()) {
            return false;
        }

        String[] words = valor.split("\\s+");
        for (String word : words) {
            if (word.length() > 2 && !Pattern.compile("[aeiouáéíóú]", Pattern.CASE_INSENSITIVE).matcher(word).find()) {
                return false;
            }
        }

        return true;
    }
}
