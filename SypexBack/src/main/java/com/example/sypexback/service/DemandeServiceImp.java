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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
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

        // Convert DTO en entity sans setter l'user
        Demande demande = demandeMapper.toEntity(dto);

        // Récupérer l'utilisateur connecté depuis le SecurityContext
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            throw new RuntimeException("Utilisateur non authentifié");
        }

        String email = auth.getName(); // normalement c'est l'email de l'utilisateur
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Associer l'utilisateur connecté à la demande
        demande.setUser(currentUser);

        // Vérifier si c'est un USER normal
        if (currentUser.getRole() == Role.EMPLOYE) {
            User responsable = currentUser.getResponsable();
            if (responsable == null) {
                throw new RuntimeException("Vous devez avoir un responsable pour créer une demande.");
            }

            // Envoyer email au responsable
            emailService.sendEmail(
                    responsable.getEmail(),
                    "Nouvelle demande de congé",
                    "L'utilisateur " + currentUser.getNom() + " " + currentUser.getPrenom() + " a soumis une nouvelle demande."
            );
        }

        // Si ADMIN ou RESPONSABLE → pas besoin de responsable, il peut créer pour lui-même
        else if (currentUser.getRole() == Role.RESPONSABLE || currentUser.getRole() == Role.ADMIN) {
            emailService.sendEmail(
                    currentUser.getEmail(),
                    "Nouvelle demande de congé",
                    "Votre demande a été enregistrée avec succès."
            );
        }

        // Sauvegarder la demande
        Demande demandeSave = demandeRepository.save(demande);

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
    public List<DemandeDTO> getDemandesByUserId(Long userId) {
        List<Demande> demandes = demandeRepository.findByUser_Id(userId);
        return demandes.stream()
                .map(d-> demandeMapper.toDto(d))
                .collect(Collectors.toList());
    }

    @Override
    public DemandeDTO updateStatutDemande(Long id, StatutDemande statut) {
        Demande demande = demandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Demande not found"));

        demande.setStatut(statut);

        if (statut == StatutDemande.ACCEPTE) {
            User user = demande.getUser();

            // 🔹 Calcul des jours ouvrables (hors samedi et dimanche)
            int jours = 0;
            LocalDateTime date = demande.getDateDebut();
            while (!date.isAfter(demande.getDateFin())) {
                DayOfWeek jour = date.getDayOfWeek();
                if (jour != DayOfWeek.SATURDAY && jour != DayOfWeek.SUNDAY) {
                    jours++;
                }
                date = date.plusDays(1);
            }

            user.setSoldeConge(user.getSoldeConge() - jours);
            userRepository.save(user);
        }

        demande.setDateDecision(LocalDateTime.now());
        Demande demandeSave = demandeRepository.save(demande);

        String message = (statut == StatutDemande.ACCEPTE)
                ? "Demande accepted"
                : "Demande rejected";

        emailService.sendEmail(
                demandeSave.getUser().getEmail(),
                "Mise a jour de votre demande",
                message
        );

        return demandeMapper.toDto(demandeSave);
    }


    @Override
    public List<Demande> getDemandesForUser(User user) {
        if(user.getRole().equals(Role.EMPLOYE)) {
            return demandeRepository.findByUser_Id(user.getId());
        } else if(user.getRole().equals(Role.RESPONSABLE)) {
            return demandeRepository.findAllByResponsable(user.getId());
        } else {
            return demandeRepository.findAll();
        }
    }

    @Override
    public List<Demande> getDemandesByResponsable(Long responsableId) {
        List<User> users = userRepository.findAllByResponsableId(responsableId);
        return users.stream()
                .flatMap(user -> demandeRepository.findByUser_Id(user.getId()).stream())
                .collect(Collectors.toList());
    }

    @Override
    public byte[] generateDemandePdf(Long id) throws DocumentException, IOException {
        Demande demande = demandeRepository.findById(id).orElseThrow(() -> new RuntimeException("Demande not found"));

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document();
        PdfWriter.getInstance(document, baos);

        document.open();

        document.add(new Paragraph("Demande de Conge"));
        document.add(new Paragraph(" "));
        document.add(new Paragraph("Employe: " + demande.getUser().getNom() + " " + demande.getUser().getPrenom()));
        document.add(new Paragraph("Date de debut: " + demande.getDateDebut().toString()));
        document.add(new Paragraph("Date de fin: " + demande.getDateFin().toString()));
        document.add(new Paragraph("Type de conge: " + demande.getType().toString()));
        document.add(new Paragraph("Statut: " + demande.getStatut().toString()));
        document.add(new Paragraph("Motif: " + demande.getMotif()));

        document.close();

        return baos.toByteArray();
    }
}
