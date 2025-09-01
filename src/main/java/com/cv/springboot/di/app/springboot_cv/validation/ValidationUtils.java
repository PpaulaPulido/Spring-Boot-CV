package com.cv.springboot.di.app.springboot_cv.validation;

public class ValidationUtils {

    public static boolean isKeyboardPattern(String text) {
        String lowerText = text.toLowerCase();
        String[] keyboardPatterns = {
            "qwerty", "asdf", "zxcv", "poiu", "lkj", "mnb",
            "123", "abc", "qwe", "asd", "zxc", "iop", "jkl", "bnm"
        };

        for (String pattern : keyboardPatterns) {
            if (lowerText.contains(pattern)) {
                return true;
            }
        }
        return false;
    }

    public static boolean isSequential(String text) {
        String lowerText = text.toLowerCase();

        // Verificar secuencias de 3 o más letras consecutivas
        for (int i = 0; i < lowerText.length() - 2; i++) {
            char char1 = lowerText.charAt(i);
            char char2 = lowerText.charAt(i + 1);
            char char3 = lowerText.charAt(i + 2);

            // Secuencia ascendente (abc, bcd, etc.)
            if (char2 == char1 + 1 && char3 == char2 + 1) {
                return true;
            }

            // Secuencia descendente (cba, dcb, etc.)
            if (char2 == char1 - 1 && char3 == char2 - 1) {
                return true;
            }
        }

        return false;
    }
}