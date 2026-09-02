package com.bharatcart.bharatcart_backend.security;

import com.bharatcart.bharatcart_backend.entity.User;
import com.bharatcart.bharatcart_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * CustomUserDetailsService — the bridge between Spring Security and our database.
 *
 * When AuthenticationManager receives a login request, it delegates here to:
 * 1. Load the user from DB by email (username)
 * 2. Return a UserDetails object that Spring Security uses to:
 *    - Compare passwords (BCrypt)
 *    - Check enabled/locked/expired status automatically
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                user.isEnabled(),            // ✅ Checked by AuthenticationManager → DisabledException
                true,                        // accountNonExpired (always true for now)
                user.isCredentialsNonExpired(), // ✅ Checked → CredentialsExpiredException
                user.isAccountNonLocked(),   // ✅ Checked → LockedException
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
        );
    }
}
