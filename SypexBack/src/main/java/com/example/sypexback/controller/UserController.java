package com.example.sypexback.controller;

import com.example.sypexback.dto.UserDTO;
import com.example.sypexback.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public List<UserDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/user/{id}")
    public UserDTO getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/updateUser/{id}")
    public UserDTO updateUser(@PathVariable Long id, @RequestBody UserDTO dto) {
        return userService.updateUser(id, dto);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/deleteUser/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/addUser")
    public UserDTO addUser(@RequestBody UserDTO dto) {
        return userService.createUser(dto);
    }

    @GetMapping("/{id}/photo")
    public ResponseEntity<byte[]> getUserPhoto(@PathVariable Long id) {
        byte[] photo = userService.getUserPhoto(id);
        if (photo == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"photo_" + id + ".jpg\"")
                .contentType(MediaType.IMAGE_JPEG) // adapter si PNG
                .body(photo);
    }

    @GetMapping("/{id}/document")
    public ResponseEntity<byte[]> getUserDocument(@PathVariable Long id) {
        byte[] document = userService.getUserDocument(id);
        if (document == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"document_" + id + ".pdf\"")
                .contentType(MediaType.APPLICATION_PDF) // adapter si Word, PNG, etc.
                .body(document);
    }

    @PostMapping("/{id}/photo")
    public ResponseEntity<String> uploadUserPhoto(@PathVariable Long id,
                                                  @RequestParam("file") MultipartFile file) {
        try {
            userService.uploadUserPhoto(id, file);
            return ResponseEntity.ok("Photo uploadée avec succès !");
        } catch (Exception e) {
            e.printStackTrace(); // <-- très important pour voir l’erreur exacte dans la console
            return ResponseEntity.status(500).body("Erreur: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/document")
    public ResponseEntity<String> uploadUserDocument(@PathVariable Long id,
                                                     @RequestParam("file") MultipartFile file) {
        userService.uploadUserDocument(id, file);
        return ResponseEntity.ok("Document uploadé avec succès !");
    }
}
