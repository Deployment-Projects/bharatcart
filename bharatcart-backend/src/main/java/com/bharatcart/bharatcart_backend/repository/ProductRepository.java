package com.bharatcart.bharatcart_backend.repository;

import com.bharatcart.bharatcart_backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}