package com.example.rhappback.service;

import com.example.rhappback.entity.User;

import java.io.ByteArrayInputStream;

public interface PdfService {
    ByteArrayInputStream generateWorkCertificate(User user);
}
