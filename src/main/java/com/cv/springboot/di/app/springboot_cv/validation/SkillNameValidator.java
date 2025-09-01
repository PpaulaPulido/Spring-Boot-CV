package com.cv.springboot.di.app.springboot_cv.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.regex.Pattern;
import java.text.Normalizer;

public class SkillNameValidator implements ConstraintValidator<ValidSkillName, String> {

    @Override
    public void initialize(ValidSkillName constraintAnnotation) {
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.trim().isEmpty()) {
            return true; // Can be handled by @NotBlank
        }

        String v = value.trim();

        // Validación de longitud
        if (v.length() < 2 || v.length() > 50) {
            return false;
        }

        // Validación de caracteres permitidos
        if (!Pattern.matches("^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\\s.+#()_\\-/&]+$", v)) {
            return false;
        }

        // Validación de caracteres repetidos (más de 4 veces)
        if (Pattern.compile("(.)\\1{4,}").matcher(v).find()) {
            return false;
        }

        // Validación de que contiene al menos una palabra válida de 2+ caracteres
        if (!Pattern.compile("\\b[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]{2,}\\b").matcher(v).find()) {
            return false;
        }

        // Validación de paréntesis vacíos o casi vacíos
        if (Pattern.compile("\\([^)]{0,2}\\)").matcher(v).find()) {
            return false;
        }

        // Validación de palabras de "basura"
        String[] basura = {"asdf", "qwerty", "lorem", "ipsum", "test", "xxxxx", "zzzzz", "dfadgafdgdsgdf", "sfadfa"};
        String n = normalizeSkillText(v);
        for (String b : basura) {
            if (n.contains(b)) {
                return false;
            }
        }

        // Validación de consonantes consecutivas
        if (Pattern.compile("[bcdfghjklmnpqrstvwxyzñ]{5,}", Pattern.CASE_INSENSITIVE)
                   .matcher(v.replaceAll("\\s", "")).find()) {
            return false;
        }

        // Validación de palabras sin vocales (excepto C# y C++)
        String[] words = v.split("\\s+");
        for (String word : words) {
            if (Pattern.matches("^(c#|c\\+\\+)$", word.toLowerCase())) {
                continue;
            }
            if (word.length() > 2 && !Pattern.compile("[aeiouáéíóú]", Pattern.CASE_INSENSITIVE)
                                            .matcher(word).find()) {
                return false;
            }
        }

        return true;
    }

    private String normalizeSkillText(String s) {
        if (s == null) {
            return "";
        }
        String normalized = Normalizer.normalize(s, Normalizer.Form.NFD);
        return normalized.replaceAll("[\\u0300-\\u036f]", "")
                        .trim()
                        .replaceAll("\\s+", " ")
                        .toLowerCase();
    }
}