package com.cv.springboot.di.app.springboot_cv.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry; //clase para manejar recursos estáticos
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer; //interfaz para configurar el comportamiento de Spring

@Configuration
public class MvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/images/**").addResourceLocations("file:uploads/images/");
    }
}