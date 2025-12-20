package com.example.foodorder.controller;

import com.example.foodorder.model.Order;
import com.example.foodorder.model.User;
import com.example.foodorder.repository.OrderRepository;
import com.example.foodorder.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, OrderRepository orderRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private User getCurrentUser(){
        var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || !(auth.getPrincipal() instanceof String)) return null;
        String username = (String) auth.getPrincipal();
        return userRepository.findByUsername(username).orElse(null);
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(){
        User u = getCurrentUser();
        if(u==null) return ResponseEntity.status(401).build();
        // mask password
        u.setPassword(null);
        return ResponseEntity.ok(u);
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateMe(@RequestBody Map<String, String> body){
        User u = getCurrentUser();
        if(u==null) return ResponseEntity.status(401).build();
        String email = body.get("email");
        String username = body.get("username");
        String password = body.get("password");
        if(email != null) u.setEmail(email);
        if(username != null) u.setUsername(username);
        if(password != null && !password.isEmpty()) u.setPassword(passwordEncoder.encode(password));
        var saved = userRepository.save(u);
        saved.setPassword(null);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/me/orders")
    public ResponseEntity<?> myOrders(){
        User u = getCurrentUser();
        if(u==null) return ResponseEntity.status(401).build();
        List<Order> orders = orderRepository.findByUserId(u.getId());
        return ResponseEntity.ok(orders);
    }
}
