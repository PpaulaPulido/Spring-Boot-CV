package com.cv.springboot.di.app.springboot_cv.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.regex.Pattern;

public class SummaryValidator implements ConstraintValidator<ValidSummary, String> {

    @Override
    public void initialize(ValidSummary constraintAnnotation) {
    }

    @Override
    public boolean isValid(String summary, ConstraintValidatorContext context) {
        if (summary == null || summary.trim().isEmpty()) {
            return true; // Not required field
        }

        String trimmedSummary = summary.trim();

        // 2. Longitud mínima y která maxima
        if (trimmedSummary.length() < 10 || trimmedSummary.length() > 1000) {
            return false;
        }

        // 3. No permitir solo letras repetidas o secuencias sin sentido
        if (Pattern.compile("^([a-zA-Z])\\1{4,}$").matcher(trimmedSummary.replaceAll("\\s+", "")).find()) {
            return false;
        }

        // 4. Debe contener al menos un verbo
        if (!Pattern.compile("\\b(trabajo|desarrollo|gestiono|coordino|creo|analizo|implemento|mejoro|lidero|mantengo|diseño|programo|optimizo|administro)\\b", Pattern.CASE_INSENSITIVE).matcher(trimmedSummary).find()) {
            return false;
        }

        // 5. Evitar texto con exceso de caracteres idénticos seguidos
        if (Pattern.compile("(.)\\1{5,}").matcher(trimmedSummary).find()) {
            return false;
        }

        // 6. Evitar que sean solo números o símbolos
        if (Pattern.matches("^[^a-zA-Z]+$", trimmedSummary)) {
            return false;
        }

        // 7. Verificar que tenga al menos una frase (punto, !, ?)
        if (!Pattern.compile("[.!?]").matcher(trimmedSummary).find()) {
            return false;
        }

        return true;
    }
}
