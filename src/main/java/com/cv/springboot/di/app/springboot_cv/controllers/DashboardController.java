package com.cv.springboot.di.app.springboot_cv.controllers;

import com.cv.springboot.di.app.springboot_cv.models.User;
import com.cv.springboot.di.app.springboot_cv.services.UserService;
import org.springframework.security.core.Authentication; 
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/user")
public class DashboardController {

    private final UserService userService;

    public DashboardController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/dashboard")
    public String showDashboard(Model model, Authentication authentication) {
        String email = authentication.getName();
        
        // Buscar el usuario por email para obtener el nombre completo
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Usar el nombre completo en lugar del email
        String fullname = user.getFirstName() + " " + user.getLastName();
        model.addAttribute("username", fullname);
        
        return "dashboard";
    }
}