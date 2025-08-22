package com.cv.springboot.di.app.springboot_cv.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;
import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.ANNOTATION_TYPE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

//Definir una anotacion personalizada para validar un email

@Target({FIELD, ANNOTATION_TYPE}) //define que la anotacion puede aplicarse a campos y otras anotaciones
@Retention(RUNTIME) //indica que la anotacion estara disponible en tiempo de ejecucion
@Constraint(validatedBy = EmailValidator.class) //especifica la clase que valida el email
@Documented //Puede ser documentada
public @interface ValidEmail {
    String message() default "Correo electrónico inválido"; //mensaje por defecto si el email no es valido
    Class<?>[] groups() default {}; //grupos de validacion, permite agrupar anotaciones
    Class<? extends Payload>[] payload() default {}; //info adicional acerca de las anotaciones
}