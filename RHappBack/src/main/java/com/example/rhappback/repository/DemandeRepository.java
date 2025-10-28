package com.example.rhappback.repository;

import com.example.rhappback.entity.Demande;
import com.example.rhappback.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DemandeRepository extends JpaRepository<Demande, Long> {
    Demande findByUserId(Long userId);

    List<Demande> findByUser_Id(Long userId);

    @Query("SELECT d FROM Demande d WHERE d.user.responsable.id = :responsableId")
    List<Demande> findAllByResponsable(@Param("responsableId") Long responsableId);

    List<Demande> findByUserResponsable_Id(Long responsableId);

    List<Demande> findAllByUserIn(List<User> users);
}
