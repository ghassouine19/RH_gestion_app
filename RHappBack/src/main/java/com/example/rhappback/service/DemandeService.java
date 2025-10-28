package com.example.rhappback.service;

import com.example.rhappback.dto.DemandeDTO;
import com.example.rhappback.entity.Demande;
import com.example.rhappback.entity.User;
import com.example.rhappback.enums.StatutDemande;
import com.lowagie.text.DocumentException;

import java.io.IOException;
import java.util.List;

public interface DemandeService {
    DemandeDTO addDemande(DemandeDTO dto);

    DemandeDTO getDemandeById(Long id);

    List<DemandeDTO> getAllDemandes();

    List<DemandeDTO> getDemandesByUserId(Long userId);

    DemandeDTO updateStatutDemande(Long id, StatutDemande statut);

    List<Demande> getDemandesForUser(User user);

    List<Demande> getDemandesByResponsable(Long responsableId);

    byte[] generateDemandePdf(Long id) throws DocumentException, IOException;
}
