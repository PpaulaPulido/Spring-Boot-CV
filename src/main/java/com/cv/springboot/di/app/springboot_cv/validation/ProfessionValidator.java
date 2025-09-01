package com.cv.springboot.di.app.springboot_cv.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.regex.Pattern;
import java.util.Arrays;
import java.util.List;

public class ProfessionValidator implements ConstraintValidator<ValidProfession, String> {

    @Override
    public void initialize(ValidProfession constraintAnnotation) {
    }

    @Override
    public boolean isValid(String profession, ConstraintValidatorContext context) {
        if (profession == null || profession.trim().isEmpty()) {
            return true; // @NotBlank se encarga de esto.
        }

        String trimmedValue = profession.trim();

        // 2. Longitud mínima y máxima
        if (trimmedValue.length() < 3 || trimmedValue.length() > 60) {
            return false;
        }

        // 3. Caracteres permitidos (letras, acentos, ñ, guiones, apóstrofos y punto)
        if (!Pattern.matches("^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ'\\-. ]+$", trimmedValue)) {
            return false;
        }

        // 4. No permitir caracteres repetidos en exceso
        if (Pattern.compile("(.)\\1\\1").matcher(trimmedValue).find()) {
            return false;
        }

        // 5. No permitir patrones de teclado o secuencias
        if (ValidationUtils.isKeyboardPattern(trimmedValue) || ValidationUtils.isSequential(trimmedValue)) {
            return false;
        }

        // 6. Validar capitalización de palabras
        String[] words = trimmedValue.split("\\s+");
        List<String> lowerExceptions = Arrays.asList("de", "del", "la", "las", "los", "y", "en", "para");
        for (int i = 0; i < words.length; i++) {
            String word = words[i];
            String lowerWord = word.toLowerCase();

            // Permitir conectores en minúscula
            if (lowerExceptions.contains(lowerWord)) {
                continue;
            }

            if (!Pattern.matches("^[A-ZÁÉÍÓÚÑÜ].*$", word)) {
                return false;
            }
        }

        return true;
    }
}
