package com.bharatcart.bharatcart_backend.controller;

import com.bharatcart.bharatcart_backend.entity.Product;
import com.bharatcart.bharatcart_backend.service.FileStorageService;
import com.bharatcart.bharatcart_backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;


import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ProductController {

    private final ProductService productService;
    private final FileStorageService fileStorageService;

    @GetMapping
    public List<Product> getProducts() {
        return productService.getAllProducts();
    }

    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        return productService.saveProduct(product);
    }

    @PostMapping(value = "/upload")
    public Map<String, String> uploadImages(
            @RequestParam("image") MultipartFile image,
            @RequestParam(value = "hoverImage", required = false) MultipartFile hoverImage) {
        
        String mainImageUrl = fileStorageService.storeFile(image);
        
        if (hoverImage != null) {
            String hoverImageUrlPath = fileStorageService.storeFile(hoverImage);
            return Map.of(
                    "imageUrl", mainImageUrl,
                    "hoverImageUrl", hoverImageUrlPath
            );
        }

        return Map.of("imageUrl", mainImageUrl);
    }

    // Get product by id
    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }


}