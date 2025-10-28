package com.example.rhappback.security;

import com.example.rhappback.enums.Role;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Data
public class RegisterRequest {
    private String username;
    private String nom;
    private String prenom;
    private int soldeConge;
    private String email;
    private String password;
    private Role role;
    private String cin;
    private String cnss;
    private String rib;
    private LocalDate dateNaissance;
    private LocalDate dateEntree;
    private LocalDate dateSortie;
    private MultipartFile photo;
    private MultipartFile document;
    private Long responsableId;
}