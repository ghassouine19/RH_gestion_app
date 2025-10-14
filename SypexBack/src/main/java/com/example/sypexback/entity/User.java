package com.example.sypexback.entity;

import com.example.sypexback.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User implements Serializable,UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String password;
    @Enumerated(EnumType.STRING)
    private Role role;
    private double soldeConge;
    private String cin;
    private String cnss;
    private String rib;
    private LocalDate dateNaissance;
    private LocalDate dateEntree;
    private LocalDate dateSortie;
    @Lob
    private byte[] photo;
    @Lob
    private byte[] document;

    @OneToMany(mappedBy = "user")
    private List<Demande> demandes;

    @ManyToOne
    @JoinColumn(name = "responsable_id")
    private User responsable;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (role == null) {
            return Collections.emptyList(); // ou tu peux throw une exception
        }
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override public String getUsername() { return email; }
    @Override public String getPassword() { return password; }
}
