package com.example.rhappback.entity;

import com.example.rhappback.enums.StatutDemande;
import com.example.rhappback.enums.TypeConge;
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
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
