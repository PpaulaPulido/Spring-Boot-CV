package com.cv.springboot.di.app.springboot_cv.services;

import com.cv.springboot.di.app.springboot_cv.models.Summary;
import com.cv.springboot.di.app.springboot_cv.models.User;
import com.cv.springboot.di.app.springboot_cv.repositories.SummaryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SummaryService {

    private final SummaryRepository summaryRepository;

    public SummaryService(SummaryRepository summaryRepository) {
        this.summaryRepository = summaryRepository;
    }

    // Crear o actualizar un resumen
    public Summary saveSummary(Summary summary) {
        return summaryRepository.save(summary);
    }

    // Obtener todos los summaries de un usuario
    public List<Summary> getSummariesByUser(User user) {
        return summaryRepository.findByUser(user);
    }

    // Obtener todos los summaries de un usuario por su ID
    public List<Summary> getSummariesByUserId(Long userId) {
        return summaryRepository.findByUserId(userId);
    }

    // Obtener un summary por su id y usuario
    public Optional<Summary> getSummaryByIdAndUserId(Long id, Long userId) {
        return summaryRepository.findByIdAndUserId(id, userId);
    }

    // Buscar summaries por profesión
    public List<Summary> searchByProfession(String profession) {
        return summaryRepository.findByProfessionContaining(profession);
    }

    // Buscar summaries por nombre
    public List<Summary> searchByFullName(String name) {
        return summaryRepository.findByFullNameContaining(name);
    }

    // Eliminar summary
    public void deleteSummary(Long id) {
        summaryRepository.deleteById(id);
    }
}
