package com.cv.springboot.di.app.springboot_cv.config;

import org.springframework.context.annotation.Configuration;
<<<<<<< HEAD
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
=======
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry; //clase para manejar recursos estáticos
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer; //interfaz para configurar el comportamiento de Spring
>>>>>>> 0702960e1c6b854e0ead5f6684babe9c8c081eba

@Configuration
public class MvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/images/**").addResourceLocations("file:uploads/images/");
    }
}