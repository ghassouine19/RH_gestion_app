package com.example.sypexback.dto;

import com.example.sypexback.enums.StatutDemande;
import com.example.sypexback.enums.TypeConge;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DemandeDTO {
    private Long id;
    private TypeConge type;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dateDebut;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dateFin;
    private String motif;
    private StatutDemande statut;
    private String commentaire;
    private LocalDateTime dateCreation;
    private LocalDateTime dateDecision;
    private Long idUser;
    private String nomUser;
    private String prenomUser;
}
