package com.example.foodorder.controller;

import com.example.foodorder.model.LoginEvent;
import com.example.foodorder.model.Order;
import com.example.foodorder.model.MenuItem;
import com.example.foodorder.model.Restaurant;
import com.example.foodorder.model.User;
import com.example.foodorder.repository.LoginEventRepository;
import com.example.foodorder.repository.OrderRepository;
import com.example.foodorder.repository.RestaurantRepository;
import com.example.foodorder.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final RestaurantRepository repo;
    private final LoginEventRepository loginEventRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public AdminController(RestaurantRepository repo, LoginEventRepository loginEventRepository, UserRepository userRepository, OrderRepository orderRepository) {
        this.repo = repo;
        this.loginEventRepository = loginEventRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    @DeleteMapping("/restaurants/{id}")
    public void deleteRestaurant(@PathVariable String id){
        if(!repo.existsById(id)){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Restaurant not found");
        }
        repo.deleteById(id);
    }

    @DeleteMapping("/restaurants")
    public void deleteRestaurantByNameAndCountry(@RequestParam String name, @RequestParam String country){
        var restOpt = repo.findByNameIgnoreCaseAndCountryIgnoreCase(name, country);
        if(restOpt.isEmpty()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Restaurant not found");
        }
        repo.delete(restOpt.get());
    }

    @PostMapping("/restaurants")
    public Restaurant createRestaurant(@RequestBody Restaurant r){
        if(r.getMenu() == null){
            r.setMenu(new ArrayList<>());
        }
        return repo.save(r);
    }

    @PutMapping("/restaurants/{id}")
    public Restaurant updateRestaurant(@PathVariable String id, @RequestBody Restaurant r){
        Restaurant existing = repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Restaurant not found"));
        existing.setName(r.getName());
        existing.setCuisine(r.getCuisine());
        existing.setCountry(r.getCountry());
        existing.setCurrency(r.getCurrency());
        existing.setRating(r.getRating());
        existing.setImageUrl(r.getImageUrl());
        if(r.getMenu()!=null){
            existing.setMenu(r.getMenu());
        }
        return repo.save(existing);
    }

    @PostMapping("/restaurants/{id}/menu")
    public Restaurant addMenuItem(@PathVariable String id, @RequestBody MenuItem item){
        Restaurant existing = repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Restaurant not found"));
        List<MenuItem> menu = existing.getMenu() == null ? new ArrayList<>() : new ArrayList<>(existing.getMenu());
        menu.add(item);
        existing.setMenu(menu);
        return repo.save(existing);
    }

    @DeleteMapping("/restaurants/{id}/menu")
    public Restaurant removeMenuItem(@PathVariable String id, @RequestParam String name){
        Restaurant existing = repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Restaurant not found"));
        List<MenuItem> menu = existing.getMenu() == null ? new ArrayList<>() : new ArrayList<>(existing.getMenu());
        menu.removeIf(m -> m.getName().equalsIgnoreCase(name));
        existing.setMenu(menu);
        return repo.save(existing);
    }

    @GetMapping("/login-history")
    public List<LoginEvent> getLoginHistory(){
        return loginEventRepository.findTop100ByOrderByLoginTimeDesc();
    }

    @GetMapping("/users")
    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

    // Orders management
    @GetMapping("/orders")
    public List<Order> getOrdersByStatus(@RequestParam(required = false) String status){
        if(status == null || status.equalsIgnoreCase("ALL")){
            return orderRepository.findAll();
        }
        return orderRepository.findByStatus(status.toUpperCase());
    }

    @GetMapping("/user-orders")
    public List<Order> getUserOrders(){
        List<User> users = userRepository.findAll();
        List<String> userIds = users.stream()
                .filter(u -> u.getRoles() == null || !u.getRoles().contains("ROLE_ADMIN"))
                .map(User::getId)
                .collect(Collectors.toList());
        if(userIds.isEmpty()) return java.util.Collections.emptyList();
        return orderRepository.findByUserIdIn(userIds);
    }

    @PutMapping("/orders/{id}/accept")
    public Order acceptOrder(@PathVariable String id){
        Order o = orderRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
        o.setStatus("ACCEPTED");
        return orderRepository.save(o);
    }

    @PutMapping("/orders/{id}/reject")
    public Order rejectOrder(@PathVariable String id){
        Order o = orderRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
        o.setStatus("REJECTED");
        return orderRepository.save(o);
    }
}
