package com.cv.springboot.di.app.springboot_cv.controllers;

import com.cv.springboot.di.app.springboot_cv.dto.request.RegisterRequest;
import com.cv.springboot.di.app.springboot_cv.models.User;
import com.cv.springboot.di.app.springboot_cv.services.UserService;
import jakarta.validation.Valid; //activar validaciones declaradas en el dto
import org.springframework.security.crypto.password.PasswordEncoder; 
import org.springframework.stereotype.Controller; 
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult; // para manejar errores de validación
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute; // para enlazar el objeto del formulario
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping; // para definir la ruta base del controlador
import org.springframework.web.bind.annotation.RequestParam; // para obtener parámetros de la URL
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/register")
    public String showRegistrationForm(Model model) {
        model.addAttribute("registerRequest", new RegisterRequest());
        return "register";
    }

    @PostMapping("/register")
    public String registerUser(@Valid @ModelAttribute() RegisterRequest registerRequest,
            BindingResult result,
            RedirectAttributes redirectAttributes) {

        // Validacion del correo
        if (userService.findByEmail(registerRequest.getEmail()).isPresent()) {
            result.rejectValue("email", "email.exists", "Este correo electrónico ya está registrado.");
        }

        if (result.hasErrors()) {
            // Si hay errores, agregamos el objeto con los errores al modelo
            redirectAttributes.addFlashAttribute("registerRequest", registerRequest);
            redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.registerRequest",
                    result);
            return "redirect:/auth/register";
        }

        // Crear y guardar el usuario
        User user = new User();
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setEmail(registerRequest.getEmail());
        user.setPhone(registerRequest.getPhone());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        userService.register(user);

        // Agregar mensaje de éxito y redirigir a la página de inicio de sesión
        redirectAttributes.addFlashAttribute("successMessage", "¡Registro exitoso! Ya puedes iniciar sesión.");
        return "redirect:/auth/login?registerSuccess=true";
    }

    // Método para la página de inicio de sesión
    @GetMapping("/login")
    public String showLoginForm(@RequestParam(required = false) String error,
            @RequestParam(required = false) String logout,
            @RequestParam(required = false) String registerSuccess,
            Model model) {

        if ("true".equals(error)) {
            model.addAttribute("errorMessage", "Correo o Contraseña Incorrectos");
        }

        if ("true".equals(logout)) {
            model.addAttribute("successMessage", "Has cerrado sesión exitosamente");
        }

        if ("true".equals(registerSuccess)) {
            model.addAttribute("successMessage", "¡Registro exitoso! Ya puedes iniciar sesión.");
        }

        return "login";
    }
}