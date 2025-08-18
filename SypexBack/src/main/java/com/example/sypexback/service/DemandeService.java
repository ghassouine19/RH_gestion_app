package com.example.sypexback.service;

import com.example.sypexback.dto.DemandeDTO;
import com.example.sypexback.enums.StatutDemande;

import java.util.List;

public interface DemandeService {
    DemandeDTO addDemande(DemandeDTO dto);

    DemandeDTO getDemandeById(Long id);

    List<DemandeDTO> getAllDemandes();

    DemandeDTO getDemandesByUserId(Long id);

    DemandeDTO updateStatutDemande(Long id, StatutDemande statut);
}
