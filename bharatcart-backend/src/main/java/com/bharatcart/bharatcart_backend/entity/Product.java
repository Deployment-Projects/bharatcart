package com.bharatcart.bharatcart_backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private Double price;

    // Legacy field — kept for backward compatibility with existing records
    private String imageUrl;

    // New structured image fields
    private String cardImageUrl;      // optimized 600x750, 4:5 ratio

    private String hoverImageUrl;     // optimized 800x1000, 4:5 ratio, lifestyle/model shot

    // Array of high-resolution detail images (stored in separate join table)
    @ElementCollection
    @CollectionTable(name = "product_detail_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "detail_image_url", length = 512)
    @Builder.Default
    private List<String> detailImageUrls = new ArrayList<>();

    @Column(length = 2000)
    private String description;

    private String category;
}
