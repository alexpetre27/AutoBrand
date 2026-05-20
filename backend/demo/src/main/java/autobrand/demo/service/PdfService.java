package autobrand.demo.service;

import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.opencsv.CSVWriter;

import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class PdfService {

    public String processPdfAndGenerateCsv(MultipartFile file) {
        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            String pdfText = stripper.getText(document);

            String[] lines = pdfText.split("\\r?\\n");
            
            List<String[]> csvData = new ArrayList<>();
            csvData.add(new String[]{"Cod produs", "Nume produs", "Pret unitar", "Moneda", "Cantitate"});

            String itemRegex = "^-?\\d+(\\.\\d+)?\\s+(RON|EUR|USD|LEI)\\s+-?\\d+(\\.\\d+)?.*";

            for (int i = 0; i < lines.length; i++) {
                String line = lines[i].trim();
                
                if (line.matches(itemRegex)) {
                    String[] parts = line.split("\\s+");
                    
                    String unitPrice = parts[0];  
                    String currency = parts[1];    
                    String quantity = parts[2];   

                    String productCode = "Necunoscut";
                    if (i + 1 < lines.length) {
                        productCode = lines[i + 1].trim();
                    }

                    StringBuilder nameBuilder = new StringBuilder();
                    for (int j = 7; j < parts.length; j++) {
                        nameBuilder.append(parts[j]).append(" ");
                    }
                    
                    String productName = nameBuilder.toString().trim();
                    if (productName.matches(".*\\d+$")) {
                        productName = productName.replaceAll("\\d+$", "").trim();
                    }

                    log.info(" Cod: {} | Nume: {} | Preț: {} | Monedă: {} | Cantitate: {}", 
                             productCode, productName, unitPrice, currency, quantity);

                    csvData.add(new String[]{productCode, productName, unitPrice, currency, quantity});
                }
            }
            return generateCsvString(csvData);
        } catch (Exception e) {
            log.error("Eroare la procesarea fișierului PDF", e);
            throw new RuntimeException("Eroare la parsarea PDF-ului: " + e.getMessage());
        }
    }

    private String generateCsvString(List<String[]> data) throws Exception {
        StringWriter writer = new StringWriter();
        try (CSVWriter csvWriter = new CSVWriter(writer)) {
            csvWriter.writeAll(data);
        }
        return writer.toString();
    }
}