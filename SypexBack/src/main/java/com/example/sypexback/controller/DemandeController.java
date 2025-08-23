package com.example.sypexback.controller;

import com.example.sypexback.dto.DemandeDTO;
import com.example.sypexback.entity.Demande;
import com.example.sypexback.entity.User;
import com.example.sypexback.enums.StatutDemande;
import com.example.sypexback.mapper.DemandeMapper;
import com.example.sypexback.repository.DemandeRepository;
import com.example.sypexback.repository.UserRepository;
import com.example.sypexback.service.DemandeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/demandes")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class DemandeController {
    private final DemandeService demandeService;
    private final DemandeMapper demandeMapper;
    private final DemandeRepository demandeRepository;
    private final UserRepository userRepository;

    @PostMapping("/add")
    public DemandeDTO addDemande(@RequestBody DemandeDTO dto) {
        return demandeService.addDemande(dto);
    }

    @GetMapping("/all")
    public List<DemandeDTO> getAllDemandes() {
        return demandeService.getAllDemandes();
    }

    @GetMapping("/demande/{id}")
    public DemandeDTO getDemandeById(@PathVariable Long id) {
        return demandeService.getDemandeById(id);
    }

    @GetMapping("/userDemande/{userId}")
    public List<DemandeDTO> getDemandeByUserId(@PathVariable Long userId) {
        return demandeService.getDemandesByUserId(userId);
    }

    @PutMapping("/{id}/statut")
    public ResponseEntity<DemandeDTO> updateStatutDemande(@PathVariable Long id, @RequestBody StatutDemande statut) {
        DemandeDTO updatedDemande = demandeService.updateStatutDemande(id, statut);
        return ResponseEntity.ok(updatedDemande);
    }

    @GetMapping("/my")
    public List<DemandeDTO> getMyDemandes(@AuthenticationPrincipal User user) {
        return demandeService.getDemandesForUser(user)
                .stream()
                .map(demandeMapper::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/my-employees/{responsableId}")
    public ResponseEntity<List<DemandeDTO>> getDemandesForResponsable(@PathVariable Long responsableId) {
        // Récupérer tous les employés qui ont ce responsable
        List<User> employes = userRepository.findAllByResponsableId(responsableId);

        if (employes.isEmpty()) {
            return ResponseEntity.ok(List.of()); // liste vide si pas d'employés
        }

        // Récupérer toutes les demandes des employés
        List<Demande> demandes = demandeRepository.findAllByUserIn(employes);

        // Convertir en DTO
        List<DemandeDTO> dtoList = demandes.stream()
                .map(demandeMapper::toDto)
                .toList();

        return ResponseEntity.ok(dtoList);
    }



}
