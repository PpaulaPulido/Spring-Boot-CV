package com.cv.springboot.di.app.springboot_cv.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.regex.Pattern;

public class FullNameValidator implements ConstraintValidator<ValidFullName, String> {

    @Override
    public void initialize(ValidFullName constraintAnnotation) {
    }

    @Override
    public boolean isValid(String fullName, ConstraintValidatorContext context) {
        if (fullName == null || fullName.trim().isEmpty()) {
            return true; // @NotBlank se encarga de la nulidad/vacío
        }

        String trimmedValue = fullName.trim();

        // 2. Validar longitud total
        if (trimmedValue.length() < 4 || trimmedValue.length() > 100) {
            return false;
        }

        // 3. Validar que tenga al menos dos palabras
        String[] nameParts = trimmedValue.split("\\s+");
        if (nameParts.length < 2) {
            return false;
        }

        // 4. Validar cada parte del nombre
        for (int i = 0; i < nameParts.length; i++) {
            String part = nameParts[i];

            // Longitud de cada parte
            if (part.length() < 2 || part.length() > 25) {
                return false;
            }

            // Caracteres permitidos (letras, algunos caracteres especiales)
            if (!Pattern.matches("^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ'’\\.\\-]+", part)) {
                return false;
            }

            // No más de 2 caracteres repetidos consecutivos
            if (Pattern.compile("(.)\\1\\1").matcher(part).find()) {
                return false;
            }

            // No patrones de teclado comunes
            if (ValidationUtils.isKeyboardPattern(part)) {
                return false;
            }

            // No secuencias alfanuméricas
            if (ValidationUtils.isSequential(part)) {
                return false;
            }

            // Validar que comience con mayúscula (excepto para prefijos como "de", "del")
            String lowerPart = part.toLowerCase();
            if (i > 0 && (lowerPart.equals("de") || lowerPart.equals("del") || lowerPart.equals("la") || lowerPart.equals("las") || lowerPart.equals("los"))) {
                continue;
            }

            if (!Pattern.matches("^[A-ZÁÉÍÓÚÑÜ].*$", part)) {
                return false;
            }
        }

        return true;
    }

    private boolean isKeyboardPattern(String text) {
        String lowerText = text.toLowerCase();
        String[] keyboardPatterns = {
            "qwerty", "asdf", "zxcv", "poiu", "lkj", "mnb",
            "123", "abc", "qwe", "asd", "zxc", "iop", "jkl", "bnm"
        };

        for (String pattern : keyboardPatterns) {
            if (lowerText.contains(pattern)) {
                return true;
            }
        }
        return false;
    }

    private boolean isSequential(String text) {
        String lowerText = text.toLowerCase();

        // Verificar secuencias de 3 o más letras consecutivas
        for (int i = 0; i < lowerText.length() - 2; i++) {
            char char1 = lowerText.charAt(i);
            char char2 = lowerText.charAt(i + 1);
            char char3 = lowerText.charAt(i + 2);

            // Secuencia ascendente (abc, bcd, etc.)
            if (char2 == char1 + 1 && char3 == char2 + 1) {
                return true;
            }

            // Secuencia descendente (cba, dcb, etc.)
            if (char2 == char1 - 1 && char3 == char2 - 1) {
                return true;
            }
        }

        return false;
    }
}
