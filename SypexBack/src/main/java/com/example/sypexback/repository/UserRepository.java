package com.example.sypexback.repository;

import com.example.sypexback.entity.User;
import com.example.sypexback.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByRole(Role role);

    List<User> findAllByRole(Role role);

    Optional<User> findByEmail(String email);
}
