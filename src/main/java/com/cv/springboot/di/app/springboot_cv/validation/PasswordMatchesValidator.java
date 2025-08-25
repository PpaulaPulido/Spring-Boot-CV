package com.cv.springboot.di.app.springboot_cv.validation;

import com.cv.springboot.di.app.springboot_cv.dto.request.RegisterRequest;
import jakarta.validation.ConstraintValidator; //validar un campo anotado con una anotacion personalizada
import jakarta.validation.ConstraintValidatorContext; //proporciona contexto para la validacion

public class PasswordMatchesValidator implements ConstraintValidator<PasswordMatches, Object> {

    @Override
    public void initialize(PasswordMatches constraintAnnotation) {
    }

    @Override
    public boolean isValid(Object obj, ConstraintValidatorContext context) {
        RegisterRequest user = (RegisterRequest) obj;
        return user.getPassword().equals(user.getConfirmPassword());
    }
}