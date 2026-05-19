package autobrand.demo.service;

import autobrand.demo.model.Product;
import autobrand.demo.repository.ProductRepository;
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
        log.info("Serviciul cron a fost pornit. Începem extragerea...");
        try {
            // 1. Autentificarea
            Connection.Response loginResponse = Jsoup.connect("https://www.web-scraping.dev/api/login")
                    .data("username", "user123") 
                    .data("password", "password")
                    .method(Connection.Method.POST)
                    .ignoreContentType(true)
                    .execute();

            Map<String, String> cookies = loginResponse.cookies();

            // 2. Accesarea paginii
            Document doc = Jsoup.connect("https://www.web-scraping.dev/products?category=consumables")
                    .cookies(cookies)
                    .get();

            Elements productElements = doc.select(".product");

            for (Element element : productElements) {
                String name = element.select("a").first() != null ? element.select("a").first().text() : "";
                String priceText = element.select(".price").text();
                String description = element.select(".short-description").text();
                String imageUrl = element.select("img.img-thumbnail").attr("src");
                String cleanPrice = priceText.replaceAll("[^0-9.]", "");
                Double price = 0.0; 

                if (!cleanPrice.isEmpty()) 
                    price = Double.parseDouble(cleanPrice);
                 else 
                    log.warn(" Nu am putut extrage prețul pentru produsul '{}'.", name);
                
                if (!name.isEmpty()) 
                    if (productRepository.findByName(name).isEmpty()) {
                        Product newProduct = Product.builder()
                                .name(name)
                                .price(price)
                                .description(description)
                                .imageUrl(imageUrl)
                                .build();
                        
                        productRepository.save(newProduct);
                        log.info("Am adăugatprodusul: {} | Preț: {} | Descriere: {}...", 
                                 name, price, description.substring(0, Math.min(description.length(), 30)));
                    } else 
                        log.info("Produsul este deja în baza de date {}", name);
                    
                
            }

            log.info("Serviciul cron s-a terminat cu succes");

        } catch (Exception e) {
            log.error("A apărut o eroare în procesul de scraping", e);
        }
    }
}