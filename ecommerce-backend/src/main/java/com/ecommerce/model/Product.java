package com.ecommerce.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "products")
public class Product {
    @Id
    private String id;
    private String title;
    private String description;
    private Double price;
    private Double discount;
    private Double finalPrice;
    private String category;
    private String brand;
    private Integer stock;
    private Double rating;
    private List<String> images;
    private String thumbnail;
    private String sellerId;
}
