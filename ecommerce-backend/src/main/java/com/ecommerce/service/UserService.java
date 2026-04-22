package com.ecommerce.service;

import com.ecommerce.model.User;
import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        // Simple validation: check if email exists
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("User with email already exists");
        }
        if (user.getRole() == null) {
            user.setRole(com.ecommerce.model.RoleType.USER);
        }
        return userRepository.save(user);
    }

    public java.util.List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User loginUser(String email, String password) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // Simple password check for demo without hashing
            if (user.getPassword().equals(password)) {
                return user;
            } else {
                throw new RuntimeException("Invalid credentials");
            }
        }
        throw new RuntimeException("User not found");
    }
}
