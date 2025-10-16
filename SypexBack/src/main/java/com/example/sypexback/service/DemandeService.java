package com.example.sypexback.service;

import com.example.sypexback.dto.DemandeDTO;
import com.example.sypexback.entity.Demande;
import com.example.sypexback.entity.User;
import com.example.sypexback.enums.StatutDemande;
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
