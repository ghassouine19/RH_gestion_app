package com.example.sypexback.dto;

import com.example.sypexback.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private Role role;
    private double soldeConge;
    private Long responsableId;
    private String cin;
    private String cnss;
    private String rib;
    private LocalDate dateNaissance;
    private LocalDate dateEntree;
    private LocalDate dateSortie;
    private String photoRrl;
    private String documentUrl;
}
