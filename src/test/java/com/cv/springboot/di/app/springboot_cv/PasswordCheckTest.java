package com.cv.springboot.di.app.springboot_cv;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class PasswordCheckTest {

    @Test
    public void testPasswordMatch() {
        // La contraseña en texto plano que el usuario ingresa
        String rawPassword = "Tequieroluna35(";  // <--- cambia esto a la contraseña que quieres probar

        // La contraseña que tienes en tu base de datos
        String encodedPassword = "$2a$10$CShhgWlO29IRHrQKa57XQOBqm1BgrrbcndT3/O3Q6/LwhEiL2h9dK";  // <--- copia tu hash

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        boolean matches = encoder.matches(rawPassword, encodedPassword);

        System.out.println("¿Coincide la contraseña?: " + matches);

        // Esto fallará si no coincide
        assertTrue(matches, "La contraseña no coincide con el hash en la base de datos");
    }
}
