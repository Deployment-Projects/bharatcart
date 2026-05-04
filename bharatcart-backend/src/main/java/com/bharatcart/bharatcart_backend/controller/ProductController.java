package com.bharatcart.bharatcart_backend.controller;

import com.bharatcart.bharatcart_backend.entity.Product;
import com.bharatcart.bharatcart_backend.service.FileStorageService;
import com.bharatcart.bharatcart_backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ProductController {

    private final ProductService productService;
    private final FileStorageService fileStorageService;

    // ─── GET All Products ────────────────────────────────────────────────────
    @GetMapping
    public List<Product> getProducts() {
        return productService.getAllProducts();
    }

    // ─── GET Product by ID ───────────────────────────────────────────────────
    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    // ─── POST Create Product ─────────────────────────────────────────────────
    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        return productService.saveProduct(product);
    }

    /**
     * POST /api/products/upload
     *
     * Accepts:
     *   - cardImage    (required)   — stored as optimized 600x750
     *   - hoverImage   (optional)   — stored as optimized 800x1000
     *   - detailImages (optional[]) — stored as high-res, up to 6 files
     *
     * Returns: { cardImageUrl, hoverImageUrl, detailImageUrls[] }
     */
    @PostMapping(value = "/upload")
    public Map<String, Object> uploadImages(
            @RequestParam(value = "cardImage", required = false) MultipartFile cardImage,
            @RequestParam(value = "hoverImage", required = false) MultipartFile hoverImage,
            @RequestParam(value = "detailImages", required = false) List<MultipartFile> detailImages) {

        Map<String, Object> response = new HashMap<>();

        // 1. Store card image (optional)
        if (cardImage != null && !cardImage.isEmpty()) {
            String cardImageUrl = fileStorageService.storeCardImage(cardImage);
            response.put("cardImageUrl", cardImageUrl);
            // Also set imageUrl for backward compatibility
            response.put("imageUrl", cardImageUrl);
        }

        // 2. Store hover image (optional)
        if (hoverImage != null && !hoverImage.isEmpty()) {
            String hoverImageUrl = fileStorageService.storeHoverImage(hoverImage);
            response.put("hoverImageUrl", hoverImageUrl);
        }

        // 3. Store detail images (optional, up to 6)
        List<String> detailImageUrls = new ArrayList<>();
        if (detailImages != null) {
            for (MultipartFile detail : detailImages) {
                if (!detail.isEmpty()) {
                    detailImageUrls.add(fileStorageService.storeDetailImage(detail));
                }
            }
        }
        response.put("detailImageUrls", detailImageUrls);

        return response;
    }

    // ─── PUT Update Product ──────────────────────────────────────────────────
    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product product) {
        return productService.updateProduct(id, product);
    }

    // ─── DELETE Product ──────────────────────────────────────────────────────
    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        // 1. Delete associated images from filesystem
        fileStorageService.deleteImage(product.getCardImageUrl());
        fileStorageService.deleteImage(product.getHoverImageUrl());
        if (product.getDetailImageUrls() != null) {
            product.getDetailImageUrls().forEach(fileStorageService::deleteImage);
        }
        // 2. Delete from DB
        productService.deleteProduct(id);
    }
}