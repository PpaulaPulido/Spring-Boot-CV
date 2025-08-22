package com.cv.springboot.di.app.springboot_cv.services;

import com.cv.springboot.di.app.springboot_cv.models.User;
import com.cv.springboot.di.app.springboot_cv.repositories.UserRepository; // Importar UserRepository para acceder a los datos del usuario
import org.springframework.beans.factory.annotation.Autowired; // inyectar dependencias
import org.springframework.security.core.userdetails.UserDetails; //datos del usuario autenticado
import org.springframework.security.core.userdetails.UserDetailsService; //Cargar usuarios desde la BD
import org.springframework.security.core.userdetails.UsernameNotFoundException; // Excepción lanzada si el usuario no se encuentra
import org.springframework.stereotype.Service; // Anotar la clase como un servicio de Spring
import java.util.Optional; // Importar Optional para manejar valores que pueden estar ausentes

@Service
public class JpaUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isEmpty()) {
            throw new UsernameNotFoundException("Usuario no encontrado");
        }

        User user = optionalUser.get();

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles("USER") 
                .build();
    }
}