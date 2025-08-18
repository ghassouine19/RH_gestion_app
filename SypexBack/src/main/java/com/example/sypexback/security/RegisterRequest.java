package com.example.sypexback.security;

import com.example.sypexback.enums.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String nom;
    private String prenom;
    private int soldeConge;
    private String email;
    private String password;
    private Role role;
}