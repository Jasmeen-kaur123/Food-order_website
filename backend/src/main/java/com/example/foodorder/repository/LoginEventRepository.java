package com.example.foodorder.repository;

import com.example.foodorder.model.LoginEvent;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoginEventRepository extends MongoRepository<LoginEvent, String> {
    List<LoginEvent> findTop100ByOrderByLoginTimeDesc();
}
