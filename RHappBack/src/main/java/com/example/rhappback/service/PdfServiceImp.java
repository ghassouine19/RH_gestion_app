package com.example.rhappback.service;

import com.example.rhappback.entity.User;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;

@Service
public class PdfServiceImp implements PdfService {

    @Override
    public ByteArrayInputStream generateWorkCertificate(User user) {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Paragraph title = new Paragraph("Attestation de Travail", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            document.add(new Paragraph(" ")); // Add a blank line

            Font contentFont = FontFactory.getFont(FontFactory.HELVETICA, 12);
            Paragraph content = new Paragraph();
            content.add(new Chunk("Je soussigné, [Nom du responsable], agissant en qualité de [Poste du responsable] de la société Sypex, certifie par la présente que ", contentFont));
            content.add(new Chunk(user.getNom() + " " + user.getPrenom(), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12)));
            content.add(new Chunk(", demeurant à [Adresse de l'employé], est employé au sein de notre entreprise en qualité de ", contentFont));
            content.add(new Chunk(user.getRole().toString(), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12)));
            content.add(new Chunk(" depuis le ", contentFont));
            content.add(new Chunk(user.getDateEntree().toString(), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12)));
            content.add(new Chunk(".", contentFont));
            document.add(content);

            document.add(new Paragraph(" ")); // Add a blank line

            Paragraph footer = new Paragraph("Fait à [Lieu], le " + java.time.LocalDate.now());
            footer.setAlignment(Element.ALIGN_RIGHT);
            document.add(footer);

            document.close();
        } catch (DocumentException e) {
            e.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }
}
