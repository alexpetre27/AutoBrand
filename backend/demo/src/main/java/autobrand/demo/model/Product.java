package autobrand.demo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "imageUrl", length = 500)
    private String imageUrl;

    @Column(name = "name", unique = true, nullable = false, length = 255)
    private String name;

    @Column(name = "price")
    private Double price;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "priceRon")
    private Double priceRon;

    @Column(name = "convRate")
    private Double exchangeRate;
}