package com.example.sypexback.mapper;

import com.example.sypexback.dto.DemandeDTO;
import com.example.sypexback.entity.Demande;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface DemandeMapper {

    @Mapping(source = "user.id", target = "idUser")
    DemandeDTO toDto(Demande demande);
    @Mapping(source = "idUser", target = "user.id")
    Demande toEntity(DemandeDTO dto);
}
