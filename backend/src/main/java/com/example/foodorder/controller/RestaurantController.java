package com.example.foodorder.controller;

import com.example.foodorder.model.Restaurant;
import com.example.foodorder.repository.RestaurantRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins = "*")
public class RestaurantController {
    private final RestaurantRepository repo;

    public RestaurantController(RestaurantRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Restaurant> list(@RequestParam(required = false) String country) {
        List<Restaurant> allRestaurants = repo.findAll();
        if (country != null && !country.isEmpty()) {
            return allRestaurants.stream()
                    .filter(r -> country.equalsIgnoreCase(r.getCountry()))
                    .collect(Collectors.toList());
        }
        return allRestaurants;
    }

    @GetMapping("/{id}")
    public Restaurant getById(@PathVariable String id) {
        return repo.findById(id).orElse(null);
    }
}
