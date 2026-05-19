package autobrand.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AutoBrandApplication {

    public static void main(String[] args) {
        SpringApplication.run(AutoBrandApplication.class, args);
    }
}