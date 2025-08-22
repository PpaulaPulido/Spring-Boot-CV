package com.cv.springboot.di.app.springboot_cv.validation;

import jakarta.validation.ConstraintValidator; //validar un campo anotado con una anotacion personalizada
import jakarta.validation.ConstraintValidatorContext; //proporciona contexto para la validacion
import java.util.regex.Matcher; //realiza operaciones de coincidencia en cadenas
import java.util.regex.Pattern; //define un patron de expresion regular

public class EmailValidator implements ConstraintValidator<ValidEmail, String> {

    private Pattern pattern;
    private Matcher matcher;
    private static final String EMAIL_PATTERN = "^(?=[^\\s@]*[a-zA-Z])[^\\s@]+@[^\\s@]+\\.(com|co|net|org)$";

    @Override
    public void initialize(ValidEmail constraintAnnotation) {
    }
    
    @Override
    public boolean isValid(String email, ConstraintValidatorContext context) {
        if (email == null) {
            return false;
        }
        pattern = Pattern.compile(EMAIL_PATTERN); //compila el patron de la expresion regular
        matcher = pattern.matcher(email); //compara el email con el patron
        return matcher.matches(); //retorna true si el email coincide con el patron
    }
}