SET NAMES utf8mb4;
USE sppr_db;

-- 1. Таблиця проєктів
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Таблиця альтернатив
CREATE TABLE alternatives (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- 3. Таблиця критеріїв
CREATE TABLE criteria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    type ENUM('maximize', 'minimize') NOT NULL,
    weight DECIMAL(5, 4) DEFAULT 1.0000, -- НОВЕ ПОЛЕ
    description TEXT,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- 4. Таблиця оцінок (Матриця рішень)
CREATE TABLE evaluations (
    alternative_id INT NOT NULL,
    criterion_id INT NOT NULL,
    value DECIMAL(10, 4) NOT NULL,
    PRIMARY KEY (alternative_id, criterion_id),
    FOREIGN KEY (alternative_id) REFERENCES alternatives(id) ON DELETE CASCADE,
    FOREIGN KEY (criterion_id) REFERENCES criteria(id) ON DELETE CASCADE
);

-- ==========================================
-- ТЕСТОВІ ДАНІ
-- ==========================================

-- Додаємо проєкт
INSERT INTO projects (id, name, description) 
VALUES (1, 'Вибір ноутбука для навчання', 'Базова задача для тестування СППР');

-- Додаємо 3 альтернативи
INSERT INTO alternatives (id, project_id, name, description) VALUES 
(1, 1, 'Laptop A (Бюджетний)', 'Базовий ноутбук з екраном 15.6 дюймів'),
(2, 1, 'Laptop B (Оптимальний)', 'Збалансована продуктивність та ціна'),
(3, 1, 'Laptop C (Преміум)', 'Висока продуктивність, дискретна відеокарта');

-- Додаємо 3 критерії
INSERT INTO criteria (id, project_id, name, type, description) VALUES 
(1, 1, 'Ціна', 'minimize', 'Вартість у доларах (менше - краще)'),
(2, 1, 'Продуктивність', 'maximize', 'Бали у бенчмарку (більше - краще)'),
(3, 1, 'Автономність', 'maximize', 'Час роботи від батареї у годинах (більше - краще)');

-- Заповнюємо матрицю оцінок (3 альтернативи * 3 критерії = 9 записів)
INSERT INTO evaluations (alternative_id, criterion_id, value) VALUES 
-- Оцінки для Laptop A
(1, 1, 500),   -- Ціна
(1, 2, 4000),  -- Продуктивність
(1, 3, 6),     -- Автономність

-- Оцінки для Laptop B
(2, 1, 800),   -- Ціна
(2, 2, 7500),  -- Продуктивність
(2, 3, 8),     -- Автономність

-- Оцінки для Laptop C
(3, 1, 1500),  -- Ціна
(3, 2, 12000), -- Продуктивність
(3, 3, 4);     -- Автономність

-- 1. Створюємо проєкт
INSERT INTO projects (id, name, description) 
VALUES (3, 'Вибір квартири для оренди', 'Пошук ідеального балансу між ціною, комфортом та розташуванням для довгострокової оренди житла.');

-- 2. Додаємо 4 альтернативи (типові варіанти на ринку)
INSERT INTO alternatives (id, project_id, name, description) VALUES 
(8, 3, 'Квартира в центрі', 'Дорого, престижно, все поруч, але мало місця і шумно.'),
(9, 3, 'Новобудова на околиці', 'Простора квартира з новим ремонтом, але далеко добиратися.'),
(10, 3, 'Смарт-квартира', 'Крихітна, але своя і відносно недалеко від метро.'),
(11, 3, 'Кімната з сусідами', 'Супер-економ варіант для студента, доводиться ділити простір.');

-- 3. Додаємо 5 критеріїв (Життєві параметри)
INSERT INTO criteria (id, project_id, name, type, weight, description) VALUES 
(9, 3, 'Ціна оренди ($/міс)', 'minimize', 0.40, 'Чим дешевше, тим краще (найважливіший критерій)'),
(10, 3, 'Час до метро (хвилин пішки)', 'minimize', 0.20, 'Скільки йти до найближчої станції'),
(11, 3, 'Площа (кв. м)', 'maximize', 0.15, 'Особистий простір'),
(12, 3, 'Стан ремонту (1-10 балів)', 'maximize', 0.15, 'Оцінка свіжості ремонту та меблів'),
(13, 3, 'Рівень шуму (1-10 балів)', 'minimize', 0.10, '1 - тиша як у лісі, 10 - вікна на жваву трасу');

-- 4. Заповнюємо матрицю оцінювання (4 квартири * 5 критеріїв = 20 записів)
INSERT INTO evaluations (alternative_id, criterion_id, value) VALUES 
-- Квартира в центрі (Дорого, близько, шумно, нормальний ремонт, середня площа)
(8, 9, 600),   -- Ціна
(8, 10, 5),    -- Хвилин до метро
(8, 11, 35),   -- Площа
(8, 12, 8),    -- Ремонт
(8, 13, 9),    -- Шум (дуже шумно)

-- Новобудова на околиці (Дешевше, далеко йти, велика, класний ремонт, тихо)
(9, 9, 350),
(9, 10, 25),
(9, 11, 55),
(9, 12, 10),
(9, 13, 2),

-- Смарт-квартира (Середня ціна, середня відстань, дуже маленька)
(10, 9, 400),
(10, 10, 10),
(10, 11, 20),
(10, 12, 7),
(10, 13, 5),

-- Кімната з сусідами (Дуже дешево, але мало місця, гірший ремонт і галасливо)
(11, 9, 150),
(11, 10, 15),
(11, 11, 15),
(11, 12, 4),
(11, 13, 8);