package com.example.rhappback.security;

import lombok.Data;

@Data
public class ChangePasswordRequest {
    private Long idUser;
    private String currentPassword;
    private String newPassword;
}
