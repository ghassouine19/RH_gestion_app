package com.example.rhappback.service;


import com.example.rhappback.dto.UserDTO;
import com.example.rhappback.entity.User;
import org.springframework.web.multipart.MultipartFile;


import java.util.List;

public interface UserService {
    List<UserDTO> getAllUsers();

    UserDTO getUserById(long id);

    UserDTO updateUser(Long id, UserDTO dto);

    void deleteUser(Long id);

    UserDTO createUser(UserDTO dto);

    User findByEmail(String email);

    byte[] getUserPhoto(Long id);

    byte[] getUserDocument(Long id);

    void uploadUserPhoto(Long id, MultipartFile file);

    void uploadUserDocument(Long id, MultipartFile file);

}
