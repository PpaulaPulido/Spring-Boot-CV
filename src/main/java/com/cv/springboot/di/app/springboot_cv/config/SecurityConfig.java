package com.cv.springboot.di.app.springboot_cv.config;

import com.cv.springboot.di.app.springboot_cv.services.JpaUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.beans.factory.annotation.Autowired;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JpaUserDetailsService jpaUserDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        // Usamos el constructor por defecto y los métodos setter.
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(jpaUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/auth/login", "/auth/register", "/css/**", "/js/**", "/images/**", "/")
                        .permitAll()
                        .requestMatchers("/user/**", "/cv/**").authenticated() 
                        .anyRequest().authenticated())
                .formLogin(form -> form
                        .loginPage("/auth/login") 
                        .loginProcessingUrl("/auth/login") 
                        .defaultSuccessUrl("/user/dashboard?loginSuccess=true", true) // Redirección después del login exitoso
                        .failureUrl("/auth/login?error=true") 
                        .permitAll())
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/auth/login?logout=true")
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                        .permitAll())
                .authenticationProvider(authenticationProvider());

        return http.build();
    }
}