package com.bharatcart.bharatcart_backend.service;

import net.coobird.thumbnailator.Thumbnails;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

/**
 * Handles structured image storage with format-aware optimization.
 *
 * Folder layout:
 *   uploads/products/card/    — optimized card images   (600×750 @85%)
 *   uploads/products/hover/   — optimized hover images  (800×1000 @85%)
 *   uploads/products/detail/  — high-res detail images  (max 1800px @92%)
 */
@Service
public class FileStorageService {

    private final Path cardDir   = Paths.get("uploads/products/card").toAbsolutePath().normalize();
    private final Path hoverDir  = Paths.get("uploads/products/hover").toAbsolutePath().normalize();
    private final Path detailDir = Paths.get("uploads/products/detail").toAbsolutePath().normalize();

    public FileStorageService() {
        try {
            Files.createDirectories(cardDir);
            Files.createDirectories(hoverDir);
            Files.createDirectories(detailDir);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create image storage directories.", ex);
        }
    }

    // ─── Card Image — 600×750 (4:5), 85% quality ────────────────────────────
    public String storeCardImage(MultipartFile file) {
        String originalFilename = generateFilename(file);
        String filename = changeExtension(originalFilename, "jpg");
        Path target = cardDir.resolve(filename);
        try {
            Thumbnails.of(file.getInputStream())
                    .size(600, 750)
                    .keepAspectRatio(false)
                    .outputQuality(0.85)
                    .outputFormat("jpg")
                    .toFile(target.toFile());
            return "/uploads/products/card/" + filename;
        } catch (IOException ex) {
            System.err.println("Error storing card image: " + ex.getMessage());
            ex.printStackTrace();
            throw new RuntimeException("Failed to store card image: " + ex.getMessage(), ex);
        }
    }

    // ─── Hover Image — 800×1000 (4:5), 85% quality ──────────────────────────
    public String storeHoverImage(MultipartFile file) {
        String originalFilename = generateFilename(file);
        String filename = changeExtension(originalFilename, "jpg");
        Path target = hoverDir.resolve(filename);
        try {
            Thumbnails.of(file.getInputStream())
                    .size(800, 1000)
                    .keepAspectRatio(false)
                    .outputQuality(0.85)
                    .outputFormat("jpg")
                    .toFile(target.toFile());
            return "/uploads/products/hover/" + filename;
        } catch (IOException ex) {
            System.err.println("Error storing hover image: " + ex.getMessage());
            ex.printStackTrace();
            throw new RuntimeException("Failed to store hover image: " + ex.getMessage(), ex);
        }
    }

    // ─── Detail Image — max 1800px wide, 92% quality (high-res) ─────────────
    public String storeDetailImage(MultipartFile file) {
        String originalFilename = generateFilename(file);
        String filename = changeExtension(originalFilename, "jpg");
        Path target = detailDir.resolve(filename);
        try {
            Thumbnails.of(file.getInputStream())
                    .width(1800)
                    .keepAspectRatio(true)
                    .outputQuality(0.92)
                    .outputFormat("jpg")
                    .toFile(target.toFile());
            return "/uploads/products/detail/" + filename;
        } catch (IOException ex) {
            System.err.println("Error storing detail image: " + ex.getMessage());
            ex.printStackTrace();
            throw new RuntimeException("Failed to store detail image: " + ex.getMessage(), ex);
        }
    }

    // ─── Legacy: kept for backward compatibility ─────────────────────────────
    public String storeFile(MultipartFile file) {
        return storeCardImage(file);
    }

    // ─── Deletion ────────────────────────────────────────────────────────────
    public void deleteImage(String imageUrl) {
        if (imageUrl == null || imageUrl.isEmpty()) return;

        // Convert URL "/uploads/products/..." to local path
        String relativePath = imageUrl.startsWith("/") ? imageUrl.substring(1) : imageUrl;
        Path target = Paths.get(relativePath).toAbsolutePath().normalize();

        try {
            Files.deleteIfExists(target);
        } catch (IOException ex) {
            System.err.println("Failed to delete image: " + imageUrl + ". Error: " + ex.getMessage());
        }
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────
    private String generateFilename(MultipartFile file) {
        String original = StringUtils.cleanPath(file.getOriginalFilename() != null
                ? file.getOriginalFilename() : "upload");
        String ext = original.contains(".") ? original.substring(original.lastIndexOf(".")) : ".jpg";
        return UUID.randomUUID().toString() + ext;
    }

    private String changeExtension(String filename, String newExt) {
        int dot = filename.lastIndexOf(".");
        String base = (dot >= 0) ? filename.substring(0, dot) : filename;
        return base + "." + newExt;
    }
}
