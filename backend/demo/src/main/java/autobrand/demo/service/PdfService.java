package autobrand.demo.service;

import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader; // <--- Importul nou
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.opencsv.CSVWriter;

import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Slf4j
public class PdfService {

    public String processPdfAndGenerateCsv(MultipartFile file) {
        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            String pdfText = stripper.getText(document);

            String regex = "^\\s*([A-Z0-9]+)\\s+(.*?)\\s+([\\d.]+)\\s+([A-Z]{3})\\s+([-]?\\d+)\\s*$";
            Pattern pattern = Pattern.compile(regex, Pattern.MULTILINE);
            Matcher matcher = pattern.matcher(pdfText);

            List<String[]> csvData = new ArrayList<>();
            csvData.add(new String[]{"Cod produs", "Nume produs", "Pret unitar", "Moneda", "Cantitate"});

            while (matcher.find()) {
                String productCode = matcher.group(1).trim();
                String productName = matcher.group(2).trim();
                String unitPrice = matcher.group(3).trim();
                String currency = matcher.group(4).trim();
                String quantity = matcher.group(5).trim();
                
                log.info("Am extras din PDF -> Cod: {} | Nume: {} | Preț: {} | Monedă: {} | Cantitate: {}", 
                         productCode, productName, unitPrice, currency, quantity);

                csvData.add(new String[]{productCode, productName, unitPrice, currency, quantity});
            }

            return generateCsvString(csvData);

        } catch (Exception e) {
            log.error("Eroare la procesarea fișierului", e);
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