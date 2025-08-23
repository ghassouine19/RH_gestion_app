package com.example.sypexback.mapper;

import com.example.sypexback.dto.UserDTO;
import com.example.sypexback.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "soldeConge", source = "soldeConge")
    @Mapping(target = "responsable.id", source = "responsableId")    User toEntity(UserDTO userDTO);

    @Mapping(target = "soldeConge", source = "soldeConge")
    @Mapping(target = "responsableId", source = "responsable.id")
    UserDTO toDto(User user);
}
