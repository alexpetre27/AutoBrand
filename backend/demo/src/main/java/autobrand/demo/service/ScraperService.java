package autobrand.demo.service;

import autobrand.demo.model.Product;
import autobrand.demo.repository.ProductRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ScraperService {

    private final ProductRepository productRepository;

    @PostConstruct 
    @Scheduled(cron = "0 0 12-18 * * *")
    public void runScraperHourly() {
        log.info("Serviciul cron a inceput");
        try {
            double exchangeRate = fetchUsdToRonRate();
            log.info("Cursul valutar: 1 USD = {} RON", exchangeRate);

            Connection.Response loginResponse = Jsoup.connect("https://www.web-scraping.dev/api/login")
                    .data("username", "user123") 
                    .data("password", "password")
                    .method(Connection.Method.POST)
                    .ignoreContentType(true)
                    .execute();

            Map<String, String> cookies = loginResponse.cookies();

            Document doc = Jsoup.connect("https://www.web-scraping.dev/products?category=consumables")
                    .cookies(cookies)
                    .get();

            Elements productElements = doc.select(".product");

            for (Element element : productElements) {
                String name = element.select("a").first() != null ? element.select("a").first().text() : "";
                String priceText = element.select(".price").text();
                String description = element.select(".shortDescription").text();
                String imageUrl = element.select("img.imgThumbnail").attr("src");

                String cleanPrice = priceText.replaceAll("[^0-9.]", "");
                Double priceUsd = 0.0; 

                if (!cleanPrice.isEmpty()) {
                    priceUsd = Double.parseDouble(cleanPrice);
                } else {
                    log.warn("Nu am putut extrage prețul pentru produsul '{}'.", name);
                }

                Double priceRon = priceUsd * exchangeRate;

                if (!name.isEmpty()) {
                    if (productRepository.findByName(name).isEmpty()) {
                        
                        Product newProduct = Product.builder()
                                .name(name)
                                .price(priceUsd)         
                                .priceRon(priceRon)    
                                .exchangeRate(exchangeRate)  
                                .description(description)
                                .imageUrl(imageUrl)
                                .build();
                        
                        productRepository.save(newProduct);
                        log.info("Produs nou: {} | $: {} | RON: {} (Rată: {})", 
                                 name, priceUsd, String.format("%.2Fi", priceRon), exchangeRate);
                    } else {
                        log.info("Produsul este deja în baza de date: {}", name);
                    }
                }
            }

            log.info("Serviciul cron a fost finalizat");

        } catch (Exception e) {
            log.error("A apărut o eroare în procesul de scraping sau de conversie", e);
        }
    }

    private double fetchUsdToRonRate() {
        try {
            String jsonResponse = Jsoup.connect("https://open.er-api.com/v6/latest/USD")
                    .ignoreContentType(true)
                    .execute()
                    .body();
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(jsonResponse);
            return rootNode.path("rates").path("RON").asDouble();
        } catch (Exception e) {
            log.warn("Nu am putut prelua cursul live, folosim valoarea de rezerva", e.getMessage());
            return 4.55; 
        }
    }
}