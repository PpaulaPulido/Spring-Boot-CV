package com.cv.springboot.di.app.springboot_cv.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;
import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.ANNOTATION_TYPE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Target({FIELD, ANNOTATION_TYPE})
@Retention(RUNTIME)
@Constraint(validatedBy = LinkedInValidator.class)
@Documented
public @interface ValidLinkedIn {
    String message() default "URL de LinkedIn inválida";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}