package com.example.foodorder.repository;

import com.example.foodorder.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
	java.util.List<com.example.foodorder.model.Order> findByUserId(String userId);
	java.util.List<com.example.foodorder.model.Order> findByStatus(String status);
	java.util.List<com.example.foodorder.model.Order> findByUserIdIn(java.util.List<String> userIds);
}
