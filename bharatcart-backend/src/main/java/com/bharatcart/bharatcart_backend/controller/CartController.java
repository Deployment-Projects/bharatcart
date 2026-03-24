package com.bharatcart.bharatcart_backend.controller;

import com.bharatcart.bharatcart_backend.entity.Cart;
import com.bharatcart.bharatcart_backend.entity.CartItem;
import com.bharatcart.bharatcart_backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping("/add/{productId}")
    public Cart addToCart(@PathVariable Long productId,
                          Authentication authentication) {

        String email = authentication.getName();
        return cartService.addToCart(email, productId);
    }

    @GetMapping
    public Cart getCart(Authentication authentication) {

        String email = authentication.getName();
        return cartService.getUserCart(email);
    }

    @DeleteMapping("/remove/{itemId}")
    public void removeItem(@PathVariable Long itemId, Authentication authentication) {
        String email = authentication.getName();
        cartService.removeItem(email, itemId);
    }

    @DeleteMapping("/remove/by-product/{productId}")
    public void removeItemByProduct(@PathVariable Long productId, Authentication authentication) {
        String email = authentication.getName();
        cartService.removeItemByProductId(email, productId);
    }

    @PutMapping("/update/{itemId}")
    public CartItem updateQuantity(@PathVariable Long itemId,
                                   @RequestParam int quantity,
                                   Authentication authentication) {
        String email = authentication.getName();
        return cartService.updateQuantity(email, itemId, quantity);
    }

    @PutMapping("/update/by-product/{productId}")
    public CartItem updateQuantityByProduct(@PathVariable Long productId,
                                            @RequestParam int quantity,
                                            Authentication authentication) {
        String email = authentication.getName();
        return cartService.updateQuantityByProductId(email, productId, quantity);
    }
}
