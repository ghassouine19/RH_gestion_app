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
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/demandes")
@RequiredArgsConstructor
public class DemandeController {
    private final DemandeService demandeService;

    @PostMapping("/add")
    public ResponseEntity<DemandeDTO> addDemande(@RequestBody DemandeDTO dto) {
        return ResponseEntity.ok(demandeService.addDemande(dto));
    }

    @GetMapping("/all")
    public ResponseEntity<List<DemandeDTO>> getAllDemandes() {
        return ResponseEntity.ok(demandeService.getAllDemandes());
    }

    @GetMapping("/demande/{id}")
    public ResponseEntity<DemandeDTO> getDemandeById(@PathVariable Long id) {
        return ResponseEntity.ok(demandeService.getDemandeById(id));
    }

    @GetMapping("/userDemande/{userId}")
    public ResponseEntity<List<DemandeDTO>> getDemandeByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(demandeService.getDemandesByUserId(userId));
    }

    @PutMapping("/updateStatut/{id}")
    public ResponseEntity<DemandeDTO> updateStatutDemande(@PathVariable Long id, @RequestParam StatutDemande statut) {
        return ResponseEntity.ok(demandeService.updateStatutDemande(id, statut));
    }

    @GetMapping("/my-employees/{responsableId}")
    public ResponseEntity<List<Demande>> getDemandesForResponsable(@PathVariable Long responsableId) {
        List<Demande> demandes = demandeService.getDemandesByResponsable(responsableId);
        return ResponseEntity.ok(demandes);
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> downloadDemandePdf(@PathVariable Long id) {
        try {
            byte[] pdf = demandeService.generateDemandePdf(id);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "demande-" + id + ".pdf");
            return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
