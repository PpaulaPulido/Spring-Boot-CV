package com.cv.springboot.di.app.springboot_cv.repositories;

import com.cv.springboot.di.app.springboot_cv.models.Summary;
import com.cv.springboot.di.app.springboot_cv.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SummaryRepository extends JpaRepository<Summary, Long> {
    
    // Encontrar todos los summaries de un usuario
    List<Summary> findByUser(User user);
    
    // Encontrar todos los summaries de un usuario por su ID
    List<Summary> findByUserId(Long userId);
    
    // Encontrar un summary específico de un usuario
    Optional<Summary> findByIdAndUserId(Long id, Long userId);
        
    // Buscar summaries por profesión 
    @Query("SELECT s FROM Summary s WHERE s.personalInfo.profession LIKE %:profession%")
    List<Summary> findByProfessionContaining(@Param("profession") String profession);
    
    // Buscar summaries por nombre
    @Query("SELECT s FROM Summary s WHERE s.personalInfo.fullName LIKE %:name%")
    List<Summary> findByFullNameContaining(@Param("name") String name);
}