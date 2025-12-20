package com.example.foodorder.service;

import com.example.foodorder.model.User;
import com.example.foodorder.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository repo;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository repo, PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(String username, String email, String password) {
        var exists = repo.findByUsername(username).isPresent() || repo.findByEmail(email).isPresent();
        if (exists) throw new RuntimeException("User already exists");

        User u = new User();
        u.setUsername(username);
        u.setEmail(email);
        u.setPassword(passwordEncoder.encode(password));
        u.setRoles(List.of("ROLE_USER"));
        return repo.save(u);
    }
}
