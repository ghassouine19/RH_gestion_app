package com.example.sypexback.service;

import com.example.sypexback.dto.DemandeDTO;
import com.example.sypexback.entity.Demande;
import com.example.sypexback.entity.User;
import com.example.sypexback.enums.Role;
import com.example.sypexback.enums.StatutDemande;
import com.example.sypexback.mapper.DemandeMapper;
import com.example.sypexback.repository.DemandeRepository;
import com.example.sypexback.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DemandeServiceImp implements DemandeService {

    private final DemandeRepository demandeRepository;
    @Autowired
    private UserRepository userRepository;
    private final DemandeMapper demandeMapper;
    private final EmailServiceImp emailService;


    @Override
    public DemandeDTO addDemande(DemandeDTO dto) {
        dto.setStatut(StatutDemande.EN_ATTENTE);
        dto.setDateCreation(LocalDateTime.now());
        dto.setDateDecision(null);

        Demande demande = demandeMapper.toEntity(dto);

        Demande demandeSave = demandeRepository.save(demande);

        List<User> responsables = userRepository.findAllByRole(Role.RESPONSABLE);
        if (responsables.isEmpty()) {
            throw new RuntimeException("No responsables found");
        }

        User responsable = responsables.get(0);

        emailService.sendEmail(
                responsable.getEmail(),
                "Nouvelle demande de congé",
                "L'utilisateur " + demandeSave.getUser().getNom() + " a soumis une nouvelle demande."
        );

        return demandeMapper.toDto(demandeSave);
    }

    @Override
    public DemandeDTO getDemandeById(Long id) {
        Demande demande = demandeRepository.findById(id).orElse(null);
        return demandeMapper.toDto(demande);
    }

    @Override
    public List<DemandeDTO> getAllDemandes() {
        List<Demande> demandes = demandeRepository.findAll();
        return demandes.stream()
                .map(d-> demandeMapper.toDto(d))
                .collect(Collectors.toList());
    }

    @Override
    public DemandeDTO getDemandesByUserId(Long userId) {
        Demande demande = demandeRepository.findByUserId(userId);
        return demandeMapper.toDto(demande);

    }

    @Override
    public DemandeDTO updateStatutDemande(Long id, StatutDemande statut) {
        Demande demande = demandeRepository.findById(id).orElseThrow(() -> new RuntimeException("Demande not found"));

        demande.setStatut(statut);
        if(statut == StatutDemande.ACCEPTE) {
            User user = demande.getUser();
            int jours = (int) ChronoUnit.DAYS.between(
                    demande.getDateDebut(), demande.getDateFin()) + 1;
            user.setSoldeConge(user.getSoldeConge() - jours);
            userRepository.save(user);
        }
        demande.setDateDecision(LocalDateTime.now());
        Demande demandeSave = demandeRepository.save(demande);

        String message = statut == StatutDemande.ACCEPTE ? "Demande accepted" : "Demande rejected";

        emailService.sendEmail(
          demandeSave.getUser().getEmail(),"Mise a jour de votre demande",message
        );

        return demandeMapper.toDto(demandeSave);
    }
}
