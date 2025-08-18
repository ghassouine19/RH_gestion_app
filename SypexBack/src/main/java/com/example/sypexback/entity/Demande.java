package com.example.sypexback.entity;

import com.example.sypexback.enums.StatutDemande;
import com.example.sypexback.enums.TypeConge;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Demande implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Enumerated(EnumType.STRING)
    private TypeConge type;
    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;
    private String motif;
    @Enumerated(EnumType.STRING)
    private StatutDemande statut;
    private String commentaire;
    private LocalDateTime dateCreation;
    private LocalDateTime dateDecision;

    @ManyToOne
    private User user;
}
