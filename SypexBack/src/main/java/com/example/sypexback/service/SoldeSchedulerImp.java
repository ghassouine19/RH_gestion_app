package com.example.sypexback.service;

import com.example.sypexback.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SoldeSchedulerImp {
    private final UserRepository userRepository;

    @Scheduled(cron = "0 0 0 1 * ?")
    @Transactional
    public void incrementerSolde() {
        userRepository.findAll().forEach(user -> {
            user.setSoldeConge(user.getSoldeConge() + 1.5);
            userRepository.save(user);
        });
        System.out.println("Mise a jour du SoldeConge");
    }
}
