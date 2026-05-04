package com.bharatcart.bharatcart_backend.service;

import com.bharatcart.bharatcart_backend.entity.Product;
import com.bharatcart.bharatcart_backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id).orElseThrow();
    }

    public Product updateProduct(Long id, Product updatedProduct) {
        Product existingProduct = getProductById(id);
        
        existingProduct.setName(updatedProduct.getName());
        existingProduct.setPrice(updatedProduct.getPrice());
        existingProduct.setDescription(updatedProduct.getDescription());
        existingProduct.setCategory(updatedProduct.getCategory());
        
        // Update images
        existingProduct.setImageUrl(updatedProduct.getImageUrl());
        existingProduct.setCardImageUrl(updatedProduct.getCardImageUrl());
        existingProduct.setHoverImageUrl(updatedProduct.getHoverImageUrl());
        existingProduct.setDetailImageUrls(updatedProduct.getDetailImageUrls());
        
        return productRepository.save(existingProduct);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}
