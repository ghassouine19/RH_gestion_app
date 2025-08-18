package com.example.sypexback.controller;

import com.example.sypexback.dto.DemandeDTO;
import com.example.sypexback.enums.StatutDemande;
import com.example.sypexback.service.DemandeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/demandes")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class DemandeController {
    private final DemandeService demandeService;

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
    public DemandeDTO getDemandeByUserId(@PathVariable Long userId) {
        return demandeService.getDemandesByUserId(userId);
    }

    @PutMapping("/{id}/statut")
    public ResponseEntity<DemandeDTO> updateStatutDemande(@PathVariable Long id, @RequestBody StatutDemande statut) {
        DemandeDTO updatedDemande = demandeService.updateStatutDemande(id, statut);
        return ResponseEntity.ok(updatedDemande);
    }
}
