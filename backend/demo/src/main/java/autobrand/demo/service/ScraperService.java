package autobrand.demo.service;

import autobrand.demo.model.Product;
import autobrand.demo.repository.ProductRepository;
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

    @Scheduled(cron = "0 0 12-18 * * *")
    public void runScraperHourly() {
        log.info("Serviciul cron a fost pornit");
        try {
              Connection.Response loginResponse = Jsoup.connect("https://www.web-scraping.dev/login")
                    .data("username", "user123") 
                    .data("password", "password")
                    .method(Connection.Method.POST)
                    .execute();

            Map<String, String> cookies = loginResponse.cookies();

            Document doc = Jsoup.connect("https://www.web-scraping.dev/products?category=consumables")
                    .cookies(cookies)
                    .get();

            Elements productElements = doc.select(".product");

            for (Element element : productElements) {
                String name = element.select(".productTitle").text();
                String priceText = element.select(".productPrice").text();
                String description = element.select(".productDescription").text();
                String imageUrl = element.select("img").attr("src");

                Double price = Double.parseDouble(priceText.replaceAll("[^0-9.]", ""));

                if (productRepository.findByName(name).isEmpty()) {
                    Product newProduct = Product.builder()
                            .name(name)
                            .price(price)
                            .description(description)
                            .imageUrl(imageUrl)
                            .build();
                    
                    productRepository.save(newProduct);
                    log.info("Am adăugat produsul {}", name);
                } else {
                    log.info("Produsul există deja {}", name);
                }
            }

            log.info("Serviciul cron s-a terminat");

        } catch (Exception e) {
            log.error("A apărut o eroare în procesul de scraping", e);
        }
    }
}