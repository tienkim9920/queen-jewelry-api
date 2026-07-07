CREATE DATABASE IF NOT EXISTS queen_jewelry CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE queen_jewelry;

-- =========================
-- USERS
-- =========================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    phone VARCHAR(50),
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =========================
-- CATEGORIES
-- =========================
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =========================
-- PRODUCTS
-- =========================
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(12,2) NOT NULL,
    discount_price DECIMAL(12,2),
    category_id INT,
    images JSON,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
) ENGINE=InnoDB;

-- =========================
-- PRODUCT VARIANTS
-- =========================
CREATE TABLE product_variants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    size VARCHAR(50),
    color VARCHAR(50),
    stock INT DEFAULT 0,
    sku VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB;

-- =========================
-- CART
-- =========================
CREATE TABLE carts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- =========================
-- CART ITEMS
-- =========================
CREATE TABLE cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT,
    product_variant_id INT,
    quantity INT DEFAULT 1,
    FOREIGN KEY (cart_id) REFERENCES carts(id),
    FOREIGN KEY (product_variant_id) REFERENCES product_variants(id)
) ENGINE=InnoDB;

-- =========================
-- ORDERS
-- =========================
CREATE TABLE orders (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id INT,
    total_price DECIMAL(12,2),
    status ENUM('pending','confirmed','shipping','completed','cancelled') DEFAULT 'pending',
    shipping_address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- =========================
-- ORDER ITEMS
-- =========================
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id CHAR(36),
    product_variant_id INT,
    quantity INT,
    price DECIMAL(12,2),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_variant_id) REFERENCES product_variants(id)
) ENGINE=InnoDB;

-- =========================
-- PAYMENTS
-- =========================
CREATE TABLE payments (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    order_id CHAR(36),
    method VARCHAR(50),
    amount DECIMAL(12,2),
    status ENUM('pending','paid','failed') DEFAULT 'pending',
    transaction_code VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id)
) ENGINE=InnoDB;

-- =========================
-- REVIEWS
-- =========================
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    product_id INT,
    rating INT,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB;

-- =========================
-- WISHLIST
-- =========================
CREATE TABLE wishlist (
    user_id INT,
    product_id INT,
    PRIMARY KEY (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB;

-- =========================
-- CMS SECTIONS
-- =========================
CREATE TABLE cms_section (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_key VARCHAR(100) NOT NULL COMMENT 'Key section',
    section_name VARCHAR(255) NULL COMMENT 'Tên hiển thị trong admin',
    content JSON NOT NULL COMMENT 'Dữ liệu JSON của section',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);