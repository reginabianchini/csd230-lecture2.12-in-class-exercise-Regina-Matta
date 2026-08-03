package app.config;

import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    private final RsaKeyProperties rsaKeys;

    public WebSecurityConfig(RsaKeyProperties rsaKeys) {
        this.rsaKeys = rsaKeys;
    }

    @Bean
    public AuthenticationManager authManager(UserDetailsService userDetailsService, PasswordEncoder passwordEncoder) {
        var authProvider = new DaoAuthenticationProvider(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return new ProviderManager(authProvider);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                // 1. Disable CSRF for API and H2 Console
                .csrf(csrf -> csrf.disable())

                // 2. Authorization Rules
                .authorizeHttpRequests(auth -> auth
                        // Public Assets & Auth
                        .requestMatchers("/", "/index.html", "/assets/**", "/favicon.svg", "/favicon.ico").permitAll()
                        .requestMatchers("/api/auth/token", "/h2-console/**", "/error").permitAll()
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()

                        // Secure API Paths (Check for ROLE_ADMIN / ROLE_USER)
                        .requestMatchers(HttpMethod.POST, "/api/rest/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/rest/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/rest/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/rest/**").hasAnyRole("ADMIN", "USER")

                        .anyRequest().authenticated()
                )

                // 3. Security Headers (Required for H2 Console frames)
                .headers(headers -> headers.frameOptions(frame -> frame.disable()))

                // 4. Stateless Session (JWT)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 5. Configure JWT Resource Server
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt ->
                        jwt.jwtAuthenticationConverter(jwtAuthenticationConverter())))

                .build();
    }

    // THIS IS THE METHOD THAT WAS MISSING
    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        // We leave the prefix as default ("SCOPE_") or set to empty if your token already has "ROLE_"
        // Since your CustomUserDetailsService uses .roles(), the token will have "ROLE_ADMIN"
        // Setting prefix to empty allows hasRole("ADMIN") to match "ROLE_ADMIN"
        grantedAuthoritiesConverter.setAuthorityPrefix("");
        grantedAuthoritiesConverter.setAuthoritiesClaimName("scope");

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
        return jwtAuthenticationConverter;
    }

    @Bean
    JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder.withPublicKey(rsaKeys.publicKey()).build();
    }

    @Bean
    JwtEncoder jwtEncoder() {
        JWK jwk = new RSAKey.Builder(rsaKeys.publicKey()).privateKey(rsaKeys.privateKey()).build();
        JWKSource<SecurityContext> jwks = new ImmutableJWKSet<>(new JWKSet(jwk));
        return new NimbusJwtEncoder(jwks);
    }
}
