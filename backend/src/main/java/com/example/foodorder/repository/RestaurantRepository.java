package com.example.foodorder.repository;

import com.example.foodorder.model.Restaurant;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface RestaurantRepository extends MongoRepository<Restaurant, String> {
	Optional<Restaurant> findByNameIgnoreCaseAndCountryIgnoreCase(String name, String country);
}
