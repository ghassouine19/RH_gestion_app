package com.example.rhappback.repository;

import com.example.rhappback.entity.User;
import com.example.rhappback.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByRole(Role role);

    List<User> findAllByRole(Role role);

    Optional<User> findByEmail(String email);

    List<User> findAllByResponsable(User responsable);

    List<User> findAllByResponsableId(Long responsableId);
}
