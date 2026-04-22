package com.ecommerce.repository;

import com.ecommerce.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    
    Page<Product> findByTitleContainingIgnoreCaseOrCategoryContainingIgnoreCase(String title, String category, Pageable pageable);
    
    @Query("{ 'category': ?0, 'price': { $gte: ?1, $lte: ?2 } }")
    Page<Product> findByCategoryAndPriceRange(String category, Double minPrice, Double maxPrice, Pageable pageable);
    
    @Query("{ 'price': { $gte: ?0, $lte: ?1 } }")
    Page<Product> findByPriceRange(Double minPrice, Double maxPrice, Pageable pageable);
}
