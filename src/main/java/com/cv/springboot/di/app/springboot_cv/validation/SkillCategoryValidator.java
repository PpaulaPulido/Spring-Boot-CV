package com.cv.springboot.di.app.springboot_cv.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.regex.Pattern;
import java.text.Normalizer;

public class SkillCategoryValidator implements ConstraintValidator<ValidSkillCategory, String> {

    @Override
    public void initialize(ValidSkillCategory constraintAnnotation) {
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.trim().isEmpty()) {
            return true; // Not required field
        }

        String v = value.trim();

        if (v.length() < 2 || v.length() > 50) {
            return false;
        }

        if (!Pattern.matches("^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\\s]+$", v)) {
            return false;
        }

        if (Pattern.compile("(.)\\1{3,}").matcher(v).find()) {
            return false;
        }

        String[] basura = {"asdf", "qwerty", "lorem", "ipsum", "test", "xxxxx", "zzzzz"};
        String n = normalizeSkillText(v);
        for (String b : basura) {
            if (n.contains(b)) {
                return false;
            }
        }

        if (Pattern.compile("[bcdfghjklmnpqrstvwxyzñ]{5,}", Pattern.CASE_INSENSITIVE).matcher(v.replaceAll("\\s", "")).find()) {
            return false;
        }

        String[] words = v.split("\\s+");
        for (String word : words) {
            if (word.length() > 2 && !Pattern.compile("[aeiouáéíóú]", Pattern.CASE_INSENSITIVE).matcher(word).find()) {
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
        return normalized.replaceAll("[\\u0300-\\u036f]", "").trim().replaceAll("\\s+", " ").toLowerCase();
    }
}
