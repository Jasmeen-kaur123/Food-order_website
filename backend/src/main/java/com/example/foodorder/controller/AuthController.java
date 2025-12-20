package com.example.foodorder.controller;

import com.example.foodorder.model.LoginEvent;
import com.example.foodorder.model.User;
import com.example.foodorder.repository.LoginEventRepository;
import com.example.foodorder.repository.UserRepository;
import com.example.foodorder.security.JwtUtil;
import com.example.foodorder.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final LoginEventRepository loginEventRepository;

    public AuthController(UserService userService, UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, LoginEventRepository loginEventRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.loginEventRepository = loginEventRepository;
    }

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody Map<String, String> body){
        String username = body.get("username");
        String email = body.get("email");
        String password = body.get("password");
        User u = userService.register(username, email, password);
        String token = jwtUtil.generateToken(u.getUsername(), u.getRoles());
        return Map.of("token", token, "username", u.getUsername(), "roles", u.getRoles());
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body, HttpServletRequest request){
        String usernameOrEmail = body.get("username");
        String password = body.get("password");

        var userOpt = userRepository.findByUsername(usernameOrEmail);
        if(userOpt.isEmpty()){
            userOpt = userRepository.findByEmail(usernameOrEmail);
        }

        if(userOpt.isEmpty()) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        var user = userOpt.get();
        if(!passwordEncoder.matches(password, user.getPassword())) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        
        // Track login event
        LoginEvent event = new LoginEvent();
        event.setUsername(user.getUsername());
        event.setEmail(user.getEmail());
        event.setLoginTime(Instant.now().toEpochMilli());
        event.setIpAddress(getClientIp(request));
        event.setUserAgent(request.getHeader("User-Agent"));
        loginEventRepository.save(event);
        
        String token = jwtUtil.generateToken(user.getUsername(), user.getRoles());
        return Map.of("token", token, "username", user.getUsername(), "roles", user.getRoles());
    }
    
    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
