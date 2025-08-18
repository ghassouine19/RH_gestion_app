package com.example.sypexback.service;


import com.example.sypexback.dto.UserDTO;
import com.example.sypexback.entity.User;


import java.util.List;

public interface UserService {
    List<UserDTO> getAllUsers();

    UserDTO getUserById(long id);

    UserDTO updateUser(Long id, UserDTO dto);

    void deleteUser(Long id);

    UserDTO createUser(UserDTO dto);

    public User findByEmail(String email);

}
