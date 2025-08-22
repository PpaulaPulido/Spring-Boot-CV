package com.cv.springboot.di.app.springboot_cv.repositories;

import com.cv.springboot.di.app.springboot_cv.models.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);  
    boolean existsByEmail(String email); // Método para verificar si un usuario con el email ya existe
}
