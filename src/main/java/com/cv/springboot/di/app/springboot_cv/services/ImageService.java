package com.cv.springboot.di.app.springboot_cv.services;

import org.springframework.stereotype.Service;
<<<<<<< HEAD
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
=======
import org.springframework.web.multipart.MultipartFile; // Importar MultipartFile para manejar archivos subidos
import java.io.IOException;
import java.nio.file.Files; // Importar Files para operaciones de archivos
import java.nio.file.Path; // Importar Path para manejar rutas de archivos
import java.nio.file.Paths; 
import java.util.Arrays;
import java.util.List;
import java.util.UUID; // Importar UUID para generar nombres únicos de archivos
>>>>>>> 0702960e1c6b854e0ead5f6684babe9c8c081eba

@Service
public class ImageService {

<<<<<<< HEAD
=======
    // Definir tipos de contenido permitidos y tamaño máximo del archivo
>>>>>>> 0702960e1c6b854e0ead5f6684babe9c8c081eba
    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
        "image/jpeg", "image/jpg", "image/png"
    );
    
<<<<<<< HEAD
=======
    // Tamaño máximo de archivo permitido (5MB)
>>>>>>> 0702960e1c6b854e0ead5f6684babe9c8c081eba
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    public String saveImage(MultipartFile imageFile, String uploadDirectory) throws IOException {
        // Validar tipo de archivo
        if (!ALLOWED_CONTENT_TYPES.contains(imageFile.getContentType())) {
            throw new IllegalArgumentException("Formato de imagen no permitido. Use JPG, PNG o JPEG.");
        }

        // Validar tamaño
        if (imageFile.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("La imagen no puede superar los 5MB.");
        }

        // Crear directorio si no existe
        Path uploadPath = Paths.get(uploadDirectory);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generar nombre único para el archivo
        String originalFileName = imageFile.getOriginalFilename();
        String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        String uniqueFileName = UUID.randomUUID().toString() + fileExtension;

        // Guardar archivo
        Path filePath = uploadPath.resolve(uniqueFileName);
        Files.copy(imageFile.getInputStream(), filePath);

        return uniqueFileName;
    }

    public void deleteImage(String fileName, String uploadDirectory) throws IOException {
        if (fileName != null && !fileName.isEmpty()) {
            Path filePath = Paths.get(uploadDirectory, fileName);
            Files.deleteIfExists(filePath);
        }
    }
}