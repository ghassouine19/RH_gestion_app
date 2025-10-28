package com.example.rhappback.mapper;

import com.example.rhappback.dto.DemandeDTO;
import com.example.rhappback.entity.Demande;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface DemandeMapper {

    @Mapping(source = "user.id", target = "idUser")
    @Mapping(source = "user.nom", target = "nomUser")
    @Mapping(source = "user.prenom", target = "prenomUser")    DemandeDTO toDto(Demande demande);

    Demande toEntity(DemandeDTO dto);
}
