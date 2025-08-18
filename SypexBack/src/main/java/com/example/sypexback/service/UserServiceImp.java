package com.example.sypexback.service;

import com.example.sypexback.dto.UserDTO;

import com.example.sypexback.entity.User;
import com.example.sypexback.mapper.UserMapper;
import com.example.sypexback.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

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
        user.setEmail(dto.getEmail());
        user.setRole(dto.getRole());
        user.setUsername(dto.getUserName());
        user.setSoldeConge(dto.getSoldeConge());

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
        User userSave = userRepository.save(user);
        return userMapper.toDto(userSave);
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
}
