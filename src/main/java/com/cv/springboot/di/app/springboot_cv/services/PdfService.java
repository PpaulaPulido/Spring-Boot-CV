package com.cv.springboot.di.app.springboot_cv.services;

import com.lowagie.text.DocumentException;
import org.springframework.stereotype.Service;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;

@Service
public class PdfService {

    public byte[] generatePdfFromHtml(String htmlContent, String baseUrl) throws DocumentException, IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ITextRenderer renderer = new ITextRenderer();

        renderer.setDocumentFromString(htmlContent, baseUrl);
        
        renderer.layout();
        renderer.createPDF(outputStream);

        return outputStream.toByteArray();
    }
}
