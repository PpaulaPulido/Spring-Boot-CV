package com.cv.springboot.di.app.springboot_cv.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload; //contiene informacion adicional sobre la anotacion personalizada
import java.lang.annotation.Documented; //indica que la anotacion debe ser documentada por javadoc u otras herramientas
import java.lang.annotation.Retention; //indica cuanto tiempo debe retenerse la anotacion
import java.lang.annotation.Target; //indica donde se puede aplicar la anotacion
import static java.lang.annotation.ElementType.ANNOTATION_TYPE; //indica que la anotacion puede aplicarse a otras anotaciones
import static java.lang.annotation.ElementType.TYPE; //puede aplicar a clases, interfaces 
import static java.lang.annotation.RetentionPolicy.RUNTIME; //la anotacion estara disponible en tiempo de ejecucion

//Definir una anotacion personalizada para validar que las contraseñas coincidan
@Target({TYPE, ANNOTATION_TYPE})
@Retention(RUNTIME)
@Constraint(validatedBy = PasswordMatchesValidator.class)
@Documented
public @interface PasswordMatches {
    String message() default "Las contraseñas no coinciden";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}