package com.bharatcart.bharatcart_backend.repository;

import com.bharatcart.bharatcart_backend.entity.Cart;
import com.bharatcart.bharatcart_backend.entity.CartItem;
import com.bharatcart.bharatcart_backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartAndProduct(Cart cart, Product product);
    Optional<CartItem> findByCartIdAndProductId(Long cartId, Long productId);
}
