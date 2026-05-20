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
        log.info("Cron a inceput");
        productRepository.deleteAll();
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
                String description = element.select(".short-description").text();
                String imageUrl = element.select("img.img-thumbnail").attr("src");

                String cleanPrice = priceText.replaceAll("[^0-9.]", "");
                Double priceUsd = cleanPrice.isEmpty() ? 0.0 : Double.parseDouble(cleanPrice);
                Double priceRon = priceUsd * exchangeRate;

                if (!name.isEmpty() && productRepository.findByName(name).isEmpty()) {
                    Product newProduct = Product.builder()
                            .name(name)
                            .price(priceUsd)
                            .priceRon(priceRon)
                            .exchangeRate(exchangeRate)
                            .description(description)
                            .imageUrl(imageUrl)
                            .build();

                    productRepository.save(newProduct);
                    log.info("SALVAT: {} | $: {} | RON: {}", name, priceUsd, String.format("%.2f", priceRon));
                }
            }
            log.info("Cron a fost finalizat");
        } catch (Exception e) {
            log.error("Eroare în procesul de scraping sau de conversie", e);
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
            log.warn("Nu am putut prelua cursul curent, folosim valoarea de rezerva");
            return 4.55;
        }
    }
}