package com.bharatcart.bharatcart_backend.controller;

import com.bharatcart.bharatcart_backend.entity.User;
import com.bharatcart.bharatcart_backend.repository.UserRepository;
import com.bharatcart.bharatcart_backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signup(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("USER");
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody User request) {
        // Delegates to Spring Security's full authentication pipeline:
        // ✅ Loads user via CustomUserDetailsService
        // ✅ Verifies BCrypt password
        // ✅ Checks isEnabled() — throws DisabledException if account is disabled
        // ✅ Checks isAccountNonLocked() — throws LockedException if account is locked
        // ✅ Checks isCredentialsNonExpired() — throws CredentialsExpiredException
        // ✅ Throws BadCredentialsException on wrong password
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // Authentication succeeded — extract email from principal and generate JWT
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtUtil.generateToken(userDetails.getUsername());

        return ResponseEntity.ok(Map.of("token", token));
    }
}
