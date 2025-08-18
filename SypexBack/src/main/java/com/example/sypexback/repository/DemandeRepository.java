package com.example.sypexback.repository;

import com.example.sypexback.entity.Demande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DemandeRepository extends JpaRepository<Demande, Long> {
    public Demande findByUserId(Long userId);
}
