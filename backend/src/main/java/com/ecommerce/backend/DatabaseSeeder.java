package com.ecommerce.backend;

import com.ecommerce.backend.model.Category;
import com.ecommerce.backend.model.Product;
import com.ecommerce.backend.model.Role;
import com.ecommerce.backend.model.User;
import com.ecommerce.backend.repository.CategoryRepository;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DatabaseSeeder(UserRepository userRepository, CategoryRepository categoryRepository,
            ProductRepository productRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            seedUsers();
        }
        if (categoryRepository.count() == 0) {
            seedCategoriesAndProducts();
        }
    }

    private void seedUsers() {
        User admin = new User();
        admin.setFullName("Admin User");
        admin.setEmail("admin@nexusmart.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(Role.ADMIN);

        User customer = new User();
        customer.setFullName("Demo Customer");
        customer.setEmail("customer@example.com");
        customer.setPassword(passwordEncoder.encode("password123"));
        customer.setRole(Role.CUSTOMER);

        userRepository.saveAll(Arrays.asList(admin, customer));
        System.out.println("Seeded Users: Admin and Demo Customer");
    }

    private void seedCategoriesAndProducts() {
        Category electronics = new Category();
        electronics.setName("Electronics");
        electronics.setDescription("Latest gadgets and devices");

        Category accessories = new Category();
        accessories.setName("Accessories");
        accessories.setDescription("Enhance your tech");

        Category furniture = new Category();
        furniture.setName("Furniture");
        furniture.setDescription("Comfort and style for your home");

        categoryRepository.saveAll(Arrays.asList(electronics, accessories, furniture));

        Product p1 = new Product();
        p1.setName("Premium Wireless Headphones");
        p1.setDescription("Experience crystal clear sound with active noise cancellation.");
        p1.setPrice(new BigDecimal("299.99"));
        p1.setStockQuantity(50);
        p1.setImageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800");
        p1.setCategory(electronics);
        p1.setRating(4.8);
        p1.setNumReviews(124);

        Product p2 = new Product();
        p2.setName("Minimalist Smartwatch");
        p2.setDescription("Track your health and stay connected in style.");
        p2.setPrice(new BigDecimal("199.50"));
        p2.setStockQuantity(30);
        p2.setImageUrl("https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800");
        p2.setCategory(accessories);
        p2.setRating(4.6);
        p2.setNumReviews(89);

        Product p3 = new Product();
        p3.setName("Ergonomic Office Chair");
        p3.setDescription("Work in comfort with lumbar support and adjustable settings.");
        p3.setPrice(new BigDecimal("249.99"));
        p3.setStockQuantity(15);
        p3.setImageUrl("https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800");
        p3.setCategory(furniture);
        p3.setRating(4.5);
        p3.setNumReviews(210);

        productRepository.saveAll(Arrays.asList(p1, p2, p3));
        System.out.println("Seeded Categories and Products");
    }
}
