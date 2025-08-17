package com.cv.springboot.di.app.springboot_cv.controllers;

import com.cv.springboot.di.app.springboot_cv.models.User;
import com.cv.springboot.di.app.springboot_cv.services.UserService;
import org.springframework.http.ResponseEntity; // Para devolver respuestas HTTP
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap; // Para crear mapas de respuesta
import java.util.Map;

@Controller
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    //Visualizar el formulario de registro
    @GetMapping("/register")
    public String registerForm(Model model) {
        model.addAttribute("user", new User());
        return "register";
    }

    // Visualizar el formulario de inicio de sesión
    @GetMapping("/login")
    public String loginForm(Model model) {
        model.addAttribute("user", new User());
        return "login";
    }

    // Manejar el envío del formulario de registro
    @PostMapping("/register")
    @ResponseBody 
    public ResponseEntity<Map<String, Object>> registerUser(@RequestBody User newUser) {
        // Crear una respuesta JSON
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Validación de email mediante el servicio
            if (userService.findByEmail(newUser.getEmail()) != null) {
                response.put("status", "error");
                response.put("message", "El correo electrónico ya está registrado");
                return ResponseEntity.badRequest().body(response);
            }
            
            User registeredUser = userService.register(newUser);
            response.put("status", "success");
            response.put("message", "Usuario registrado correctamente");
            response.put("userId", registeredUser.getId());
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } 
    }

    // Manejar el envío del formulario de inicio de sesión
    @PostMapping("/login")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody User loginUser) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            //Verificar si el correo existe
            User user = userService.findByEmail(loginUser.getEmail());
            if (user == null) {
                response.put("status", "error");
                response.put("message", "El correo no está registrado");
                return ResponseEntity.status(404).body(response); 
            }

            // Verificar contraseña
            if (!user.getPassword().equals(loginUser.getPassword())) {
                response.put("status", "error");
                response.put("message", "Contraseña incorrecta");
                return ResponseEntity.status(401).body(response); 
            }

            //Login exitoso
            response.put("status", "success");
            response.put("message", "Inicio de sesión exitoso");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error en el servidor: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response); // 500 Internal Server Error
        }
    }
}