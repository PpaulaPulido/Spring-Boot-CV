package com.cv.springboot.di.app.springboot_cv.services;

import com.cv.springboot.di.app.springboot_cv.models.User;
import com.cv.springboot.di.app.springboot_cv.repositories.UserRepository;

import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepo;

    public UserService(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    public Optional<User> findByEmail(String email) {
        return userRepo.findByEmail(email);
    }

    public User register(User user) {
        return userRepo.save(user); 
    }

}