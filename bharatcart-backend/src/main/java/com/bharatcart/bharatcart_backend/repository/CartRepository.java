package com.bharatcart.bharatcart_backend.repository;

import com.bharatcart.bharatcart_backend.entity.Cart;
import com.bharatcart.bharatcart_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {

    @EntityGraph(attributePaths = {"items", "items.product"})
    Optional<Cart> findByUser(User user);
}