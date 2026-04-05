package com.bharatcart.bharatcart_backend.service;

import com.bharatcart.bharatcart_backend.entity.*;
import com.bharatcart.bharatcart_backend.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Optional;

import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
@Transactional
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public Cart addToCart(String email, Long productId) {

        User user = userRepository.findByEmail(email)
                .orElseThrow();

        //checking if logged in user has existing cart or not and if not, then creating new cart
        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> cartRepository.save(
                        Cart.builder()
                                .user(user)
                                .items(new ArrayList<>())
                                .build()
                ));

        Product product = productRepository.findById(productId)
                .orElseThrow();

        // 🔥 Check if product already exists in cart
        Optional<CartItem> existingItem =
                cartItemRepository.findByCartAndProduct(cart, product);

        if (existingItem.isPresent()) {

            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + 1);
            cartItemRepository.save(item);

        } else {

            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(1)
                    .build();

            cartItemRepository.save(newItem);
            cart.getItems().add(newItem);
        }

        return cartRepository.save(cart);
    }

    public Cart getUserCart(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow();

        return cartRepository.findByUser(user)
                .orElseThrow();
    }

    public void removeItem(String email, Long itemId) {
        System.out.println("Deleting item id: " +itemId + " for User: "+email);
        CartItem item = findOwnedCartItem(email, itemId);
        System.out.println("item: "+item);
        Cart cart = item.getCart();

        // ✅ Remove from cart list
        cart.getItems().remove(item);

        // ✅ Delete explicitly
        cartItemRepository.delete(item);

    }

    public void removeItemByProductId(String email, Long productId) {
        CartItem item = findOwnedCartItemByProductId(email, productId);
        cartItemRepository.delete(item);
    }

    public CartItem updateQuantity(String email, Long itemId, int quantity) {
        if (quantity < 1) {
            throw new ResponseStatusException(BAD_REQUEST, "Quantity must be at least 1");
        }

        CartItem item = findOwnedCartItem(email, itemId);
        item.setQuantity(quantity);
        return cartItemRepository.save(item);
    }

    public CartItem updateQuantityByProductId(String email, Long productId, int quantity) {
        if (quantity < 1) {
            throw new ResponseStatusException(BAD_REQUEST, "Quantity must be at least 1");
        }

        CartItem item = findOwnedCartItemByProductId(email, productId);
        item.setQuantity(quantity);
        return cartItemRepository.save(item);
    }

    private CartItem findOwnedCartItem(String email, Long itemId) {
        Cart userCart = findOwnedCart(email);

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Cart item not found"));

        if (!item.getCart().getId().equals(userCart.getId())) {
            throw new ResponseStatusException(FORBIDDEN, "Cart item does not belong to the authenticated user");
        }

        return item;
    }

    private CartItem findOwnedCartItemByProductId(String email, Long productId) {
        Cart userCart = findOwnedCart(email);

        return cartItemRepository.findByCartIdAndProductId(userCart.getId(), productId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Cart item not found"));
    }

    private Cart findOwnedCart(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found"));

        return cartRepository.findByUser(user)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Cart not found"));
    }
}
