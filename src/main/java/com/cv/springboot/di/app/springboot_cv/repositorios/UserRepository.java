package com.cv.springboot.di.app.springboot_cv.repositorios;

import com.cv.springboot.di.app.springboot_cv.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email); // Método para encontrar un usuario por su email
    boolean existsByEmail(String email); // Método para verificar si un usuario con el email ya existe
}
