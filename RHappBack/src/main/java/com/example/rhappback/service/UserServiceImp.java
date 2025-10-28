package com.example.rhappback.service;

import com.example.rhappback.dto.UserDTO;

import com.example.rhappback.entity.User;

import com.example.rhappback.mapper.UserMapper;

import com.example.rhappback.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class UserServiceImp implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserServiceImp(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    @Override
    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(u-> userMapper.toDto(u))
                .collect(Collectors.toList());
    }

    @Override
    public UserDTO getUserById(long id) {
        User user = userRepository.findById(id).orElse(null);
        return userMapper.toDto(user);
    }

    @Override
    public UserDTO updateUser(Long id, UserDTO dto) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setNom(dto.getNom());
        user.setPrenom(dto.getPrenom());
        user.setEmail(dto.getEmail());
        user.setRole(dto.getRole());
        user.setSoldeConge(dto.getSoldeConge());
        if (dto.getResponsableId() != null) {
            User responsable = userRepository.findById(dto.getResponsableId())
                    .orElseThrow(() -> new RuntimeException("Responsable non trouvé"));
            user.setResponsable(responsable);
        } else {
            user.setResponsable(null); // si on veut autoriser à enlever le responsable
        }

        userRepository.save(user);
        return userMapper.toDto(user);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.deleteById(id);
    }

    @Override
    public UserDTO createUser(UserDTO dto) {
        User user = userMapper.toEntity(dto);
        user.setSoldeConge(dto.getSoldeConge());
        user.setRole(dto.getRole());

        // Récupérer et assigner le responsable si fourni
        User responsable = null;
        if (dto.getResponsableId() != null) {
            responsable = userRepository.findById(dto.getResponsableId())
                    .orElseThrow(() -> new RuntimeException("Responsable non trouvé"));
        }
        user.setResponsable(responsable);

        User userSave = userRepository.save(user);
        return userMapper.toDto(userSave);
    }


    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    @Override
    public byte[] getUserPhoto(Long id) {
        return userRepository.findById(id)
                .map(User::getPhoto)
                .orElse(null);
    }

    @Override
    public byte[] getUserDocument(Long id) {
        return userRepository.findById(id)
                .map(User::getDocument)
                .orElse(null);
    }

    @Override
    public void uploadUserPhoto(Long id, MultipartFile file) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable avec id : " + id));
        try {
            user.setPhoto(file.getBytes());
            userRepository.save(user);
        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de l’upload de la photo", e);
        }
    }

    @Override
    public void uploadUserDocument(Long id, MultipartFile file) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable avec id : " + id));
        try {
            user.setDocument(file.getBytes());
            userRepository.save(user);
        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de l’upload du document", e);
        }
    }
}
