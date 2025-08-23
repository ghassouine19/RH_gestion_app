package com.example.sypexback.security;

import com.example.sypexback.dto.UserDTO;
import com.example.sypexback.entity.User;
import com.example.sypexback.enums.Role;
import com.example.sypexback.mapper.UserMapper;
import com.example.sypexback.repository.UserRepository;
import com.example.sypexback.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;
    private final UserMapper userMapper;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

            User user = (User) authentication.getPrincipal();
            String token = jwtUtil.generateToken(user.getId(), user.getUsername(),user.getRole().name());
            return new LoginResponse(user.getId() ,token, user.getRole().name());
        } catch (AuthenticationException e) {
            throw new RuntimeException("Email ou mot de passe invalide");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody RegisterRequest request) {
        User newUser = new User();
        newUser.setNom(request.getNom());
        newUser.setPrenom(request.getPrenom());
        newUser.setSoldeConge(request.getSoldeConge());
        newUser.setEmail(request.getEmail());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setRole(request.getRole());

        // Associer le responsable si le rôle est EMPLOYE
        if (request.getRole() == Role.EMPLOYE && request.getResponsableId() != null) {
            User responsable = userRepository.findById(request.getResponsableId())
                    .orElseThrow(() -> new RuntimeException("Responsable non trouvé"));
            newUser.setResponsable(responsable);
        }

        userRepository.save(newUser);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Inscription réussie");
        return ResponseEntity.ok(response);
    }



    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        Object principal = authentication.getPrincipal();

        User user;
        if (principal instanceof User) {
            user = (User) principal;
        } else {
            String username = principal.toString();
            user = userService.findByEmail(username);
        }

        UserDTO dto = userMapper.toDto(user);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(
            @RequestBody ChangePasswordRequest request) {

        User user = userRepository.findById(request.getIdUser())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Le mot de passe actuel est incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Mot de passe modifié avec succès");
        return ResponseEntity.ok(response);
    }




}

