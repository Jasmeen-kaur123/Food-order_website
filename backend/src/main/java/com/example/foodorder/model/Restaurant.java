package com.example.foodorder.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "restaurants")
public class Restaurant {
    @Id
    private String id;
    private String name;
    private String cuisine;
    private String country;
    private String currency;
    private double rating;
    private String imageUrl;
    private List<MenuItem> menu;

    public Restaurant() {}

    public Restaurant(String id, String name, String cuisine, String country, String currency, double rating, String imageUrl, List<MenuItem> menu) {
        this.id = id;
        this.name = name;
        this.cuisine = cuisine;
        this.country = country;
        this.currency = currency;
        this.rating = rating;
        this.imageUrl = imageUrl;
        this.menu = menu;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCuisine() { return cuisine; }
    public void setCuisine(String cuisine) { this.cuisine = cuisine; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public List<MenuItem> getMenu() { return menu; }
    public void setMenu(List<MenuItem> menu) { this.menu = menu; }
}
