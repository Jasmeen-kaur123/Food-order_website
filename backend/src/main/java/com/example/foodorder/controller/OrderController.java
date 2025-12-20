package com.example.foodorder.controller;

import com.example.foodorder.model.Order;
import com.example.foodorder.repository.OrderRepository;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {
    private final OrderRepository repo;
    private final com.example.foodorder.repository.UserRepository userRepository;

    public OrderController(OrderRepository repo, com.example.foodorder.repository.UserRepository userRepository) {
        this.repo = repo;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Order> list() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public Order getById(@PathVariable String id) {
        return repo.findById(id).orElse(null);
    }

    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        order.setStatus("PENDING");
        order.setCreatedAt(Instant.now().toEpochMilli());
        // calculate total if not provided
        if (order.getTotal() == 0 && order.getItems() != null) {
            double s = 0;
            for (var it : order.getItems()) s += it.getPrice() * it.getQuantity();
            order.setTotal(s);
        }
        // If authenticated, set userId from authenticated username (but keep the customerName from request)
        var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof String) {
            String username = (String) auth.getPrincipal();
            var userOpt = userRepository.findByUsername(username);
            userOpt.ifPresent(u -> order.setUserId(u.getId()));
        }
        return repo.save(order);
    }
}
