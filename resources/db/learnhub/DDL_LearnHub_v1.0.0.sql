-- ════════════════════════════════════════════════════════════
-- LEARNHUB — DDL
-- Plataforma de Cursos Online
-- Módulo 3: Persistencia con Hibernate | Ed. 20 | DGTIC-UNAM
-- Instructor: Alfonso Hernández Xochipa | hxadev.tech
-- ════════════════════════════════════════════════════════════

DROP DATABASE IF EXISTS learnhub;

CREATE DATABASE learnhub
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE learnhub;

-- ════════════════════════════════════════════════════════════
-- LEVELS
-- ════════════════════════════════════════════════════════════
CREATE TABLE levels (
    id INT PRIMARY KEY,
    title VARCHAR(100),
    description TEXT,
    active BOOLEAN DEFAULT TRUE
);

-- ════════════════════════════════════════════════════════════
-- CATEGORIES
-- ════════════════════════════════════════════════════════════
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURDATE()
);

-- ════════════════════════════════════════════════════════════
-- INSTRUCTORS
-- ════════════════════════════════════════════════════════════
CREATE TABLE instructors (
    id VARCHAR(10) PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    bio TEXT,
    speciality VARCHAR(30),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURDATE()
);

-- ════════════════════════════════════════════════════════════
-- COURSES
-- ════════════════════════════════════════════════════════════
CREATE TABLE courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    duration INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURDATE(),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ranking INT DEFAULT 0,
    level_id INT,
    category_id INT,

    CONSTRAINT fk_courses_level
        FOREIGN KEY (level_id) REFERENCES levels(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT fk_courses_category
        FOREIGN KEY (category_id) REFERENCES categories(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,

    CHECK (price >= 0),
    CHECK (duration >= 0),
    CHECK (ranking >= 0 AND ranking <= 5)
);

-- ════════════════════════════════════════════════════════════
-- INSTRUCTORS_COURSES (Tabla intermedia N:M)
-- ════════════════════════════════════════════════════════════
CREATE TABLE instructors_courses (
    id_course INT NOT NULL,
    id_instructor VARCHAR(10) NOT NULL,

    PRIMARY KEY (id_course, id_instructor),

    CONSTRAINT fk_ic_course
        FOREIGN KEY (id_course) REFERENCES courses(id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_ic_instructor
        FOREIGN KEY (id_instructor) REFERENCES instructors(id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- ════════════════════════════════════════════════════════════
-- MODULES
-- ════════════════════════════════════════════════════════════
CREATE TABLE modules (
    id VARCHAR(15) PRIMARY KEY,
    title VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    position INT DEFAULT 1,
    duration INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    id_course INT NOT NULL,

    CONSTRAINT fk_modules_course
        FOREIGN KEY (id_course) REFERENCES courses(id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CHECK (position > 0),
    CHECK (duration >= 0)
);

-- ════════════════════════════════════════════════════════════
-- STUDENTS
-- ════════════════════════════════════════════════════════════
CREATE TABLE students (
    id VARCHAR(15) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(50) NOT NULL,
    birth_date DATE,
    country CHAR(3),
    city VARCHAR(30),
    state VARCHAR(40),
    active BOOLEAN DEFAULT TRUE
);

-- ════════════════════════════════════════════════════════════
-- ENROLLMENTS
-- ════════════════════════════════════════════════════════════
CREATE TABLE enrollments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_student VARCHAR(15) NOT NULL,
    id_course INT NOT NULL,
    enrollment_date TIMESTAMP DEFAULT CURDATE(),
    grade DECIMAL(4,2),
    status ENUM('ENROLLED', 'IN_PROGRESS', 'COMPLETED', 'DROPPED') DEFAULT 'ENROLLED',
    completion_date TIMESTAMP NULL,

    CONSTRAINT fk_enrollments_student
        FOREIGN KEY (id_student) REFERENCES students(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT fk_enrollments_course
        FOREIGN KEY (id_course) REFERENCES courses(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT uq_student_course UNIQUE (id_student, id_course),

    CHECK (grade >= 0 AND grade <= 10)
);

-- ════════════════════════════════════════════════════════════
-- ÍNDICES
-- ════════════════════════════════════════════════════════════
CREATE INDEX idx_courses_level ON courses(level_id);
CREATE INDEX idx_courses_category ON courses(category_id);
CREATE INDEX idx_modules_course ON modules(id_course);
CREATE INDEX idx_enrollments_student ON enrollments(id_student);
CREATE INDEX idx_enrollments_course ON enrollments(id_course);
CREATE INDEX idx_enrollments_status ON enrollments(status);

-- ════════════════════════════════════════════════════════════
-- DATOS INICIALES: LEVELS
-- ════════════════════════════════════════════════════════════
INSERT INTO levels (id, title, description, active) VALUES
(1, 'BEGINNER', 'Beginner learner without most experience', TRUE),
(2, 'INTERMEDIATE', 'Learner who has experience working on the topic', TRUE),
(3, 'ADVANCED', 'Experienced with experience solving real solutions', TRUE);

-- ════════════════════════════════════════════════════════════
-- DATOS INICIALES: CATEGORIES
-- ════════════════════════════════════════════════════════════
INSERT INTO categories (name, description, active) VALUES
('Programación', 'Lenguajes de programación y desarrollo de software', TRUE),
('Bases de Datos', 'Diseño, administración y consulta de bases de datos', TRUE),
('Cloud Computing', 'Servicios en la nube y despliegue de aplicaciones', TRUE),
('DevOps', 'Integración continua, contenedores y automatización', TRUE),
('Desarrollo Web', 'Frontend, backend y fullstack web', TRUE),
('Inteligencia Artificial', 'Machine learning, deep learning y NLP', TRUE),
('Seguridad', 'Ciberseguridad y seguridad de aplicaciones', TRUE),
('Arquitectura de Software', 'Patrones, diseño y arquitectura de sistemas', TRUE);

-- ════════════════════════════════════════════════════════════
-- DATOS INICIALES: INSTRUCTORS
-- ════════════════════════════════════════════════════════════
INSERT INTO instructors (id, first_name, last_name, email, bio, speciality) VALUES
('INS-001', 'Alfonso', 'Hernández', 'alfonso@learnhub.com', 'Software Engineer con 8+ años en backend y arquitectura', 'Java, Spring Boot'),
('INS-002', 'María', 'González', 'maria@learnhub.com', 'Especialista en bases de datos Oracle y MySQL', 'SQL, Hibernate'),
('INS-003', 'Carlos', 'Ramírez', 'carlos@learnhub.com', 'DevOps engineer certificado AWS y Azure', 'Docker, Kubernetes'),
('INS-004', 'Laura', 'Torres', 'laura@learnhub.com', 'Desarrolladora fullstack React y Node.js', 'JavaScript, React'),
('INS-005', 'Roberto', 'Díaz', 'roberto@learnhub.com', 'Investigador en IA y docente universitario', 'Python, TensorFlow'),
('INS-006', 'Ana', 'Morales', 'ana@learnhub.com', 'Especialista en seguridad y ethical hacking', 'Pentesting, OAuth2');

-- ════════════════════════════════════════════════════════════
-- DATOS INICIALES: COURSES
-- ════════════════════════════════════════════════════════════
INSERT INTO courses (title, description, price, duration, active, ranking, level_id, category_id) VALUES
('Java desde Cero', 'Aprende Java SE desde fundamentos hasta POO avanzada', 2999.00, 40, TRUE, 5, 1, 1),
('Hibernate y JPA', 'Persistencia de datos con Hibernate en aplicaciones Java', 3499.00, 20, TRUE, 4, 2, 1),
('Spring Boot REST API', 'Diseño e implementación de APIs RESTful', 3999.00, 30, TRUE, 5, 2, 1),
('SQL para Analistas', 'Consultas SQL desde básico hasta avanzado', 1999.00, 15, TRUE, 4, 1, 2),
('Diseño de Bases de Datos', 'Modelado relacional y normalización', 2499.00, 20, TRUE, 3, 1, 2),
('Docker para Desarrolladores', 'Contenedores, imágenes y Docker Compose', 2999.00, 20, TRUE, 4, 2, 4),
('Kubernetes en Producción', 'Orquestación de contenedores escalables', 4499.00, 30, TRUE, 5, 3, 4),
('React Completo', 'Frontend moderno con React, Hooks y Context API', 3499.00, 35, TRUE, 4, 2, 5),
('Node.js y Express', 'Backend con JavaScript usando Node.js', 2999.00, 25, TRUE, 3, 2, 5),
('Machine Learning con Python', 'Introducción práctica a ML con scikit-learn', 4999.00, 40, TRUE, 5, 3, 6),
('Spring Security con JWT', 'Autenticación y autorización en APIs', 3999.00, 20, TRUE, 4, 3, 7),
('Arquitectura de Microservicios', 'Patrones para sistemas distribuidos con Java', 4999.00, 30, TRUE, 5, 3, 8);

-- ════════════════════════════════════════════════════════════
-- DATOS INICIALES: INSTRUCTORS_COURSES
-- ════════════════════════════════════════════════════════════
INSERT INTO instructors_courses (id_course, id_instructor) VALUES
(1, 'INS-001'),
(2, 'INS-001'),
(3, 'INS-001'),
(12, 'INS-001'),
(4, 'INS-002'),
(5, 'INS-002'),
(6, 'INS-003'),
(7, 'INS-003'),
(8, 'INS-004'),
(9, 'INS-004'),
(10, 'INS-005'),
(11, 'INS-006');

-- ════════════════════════════════════════════════════════════
-- DATOS INICIALES: MODULES
-- ════════════════════════════════════════════════════════════
INSERT INTO modules (id, title, description, position, duration, active, id_course) VALUES
-- Java desde Cero
('MOD-001', 'Introducción a Java', 'Historia, JDK, primer programa', 1, 300, TRUE, 1),
('MOD-002', 'Tipos de datos y operadores', 'Variables, tipos primitivos, operadores', 2, 360, TRUE, 1),
('MOD-003', 'Estructuras de control', 'if, switch, for, while', 3, 300, TRUE, 1),
('MOD-004', 'POO Básica', 'Clases, objetos, herencia', 4, 480, TRUE, 1),
-- Hibernate y JPA
('MOD-005', 'Introducción a ORM', 'Qué es ORM, historia, JPA vs Hibernate', 1, 240, TRUE, 2),
('MOD-006', 'Configuración y Entidades', 'persistence.xml, @Entity, @Id, CRUD', 2, 300, TRUE, 2),
('MOD-007', 'Relaciones y Consultas', 'OneToMany, ManyToMany, HQL', 3, 300, TRUE, 2),
('MOD-008', 'Validaciones y Buenas Prácticas', 'Bean Validation, filtros, DAO', 4, 240, TRUE, 2),
-- Spring Boot REST API
('MOD-009', 'Intro a Spring Boot', 'Spring Initializr, estructura, auto-config', 1, 300, TRUE, 3),
('MOD-010', 'Controllers y Endpoints', '@RestController, @GetMapping, @PostMapping', 2, 360, TRUE, 3),
('MOD-011', 'Persistencia con Spring Data', 'JpaRepository, consultas derivadas', 3, 360, TRUE, 3),
('MOD-012', 'Manejo de errores', '@ControllerAdvice, @Valid', 4, 300, TRUE, 3),
-- SQL para Analistas
('MOD-013', 'SELECT y WHERE', 'Consultas básicas, filtrado', 1, 180, TRUE, 4),
('MOD-014', 'JOINs y Agregaciones', 'INNER JOIN, LEFT JOIN, GROUP BY', 2, 240, TRUE, 4),
('MOD-015', 'Subconsultas y Vistas', 'Subconsultas, CREATE VIEW', 3, 240, TRUE, 4),
-- Diseño de Bases de Datos
('MOD-016', 'Modelado conceptual', 'Entidades, atributos, relaciones', 1, 240, TRUE, 5),
('MOD-017', 'Normalización', '1FN, 2FN, 3FN', 2, 300, TRUE, 5),
('MOD-018', 'Implementación SQL', 'DDL, constraints, índices', 3, 300, TRUE, 5);

-- ════════════════════════════════════════════════════════════
-- DATOS INICIALES: STUDENTS
-- ════════════════════════════════════════════════════════════
INSERT INTO students (id, first_name, last_name, email, birth_date, country, city, state) VALUES
('STU-001', 'Pedro', 'López Ramírez', 'pedro.lopez@email.com', '1998-03-15', 'MEX', 'Ciudad de México', 'CDMX'),
('STU-002', 'Sofía', 'Martínez Ruiz', 'sofia.martinez@email.com', '1999-07-22', 'MEX', 'Guadalajara', 'Jalisco'),
('STU-003', 'Diego', 'García Flores', 'diego.garcia@email.com', '1997-11-08', 'MEX', 'Monterrey', 'Nuevo León'),
('STU-004', 'Valentina', 'Rodríguez Sánchez', 'valentina.rod@email.com', '2000-01-30', 'MEX', 'Puebla', 'Puebla'),
('STU-005', 'Andrés', 'Hernández Cruz', 'andres.hdz@email.com', '1996-09-14', 'MEX', 'Querétaro', 'Querétaro'),
('STU-006', 'Camila', 'Flores Torres', 'camila.flores@email.com', '2001-05-18', 'MEX', 'Tijuana', 'Baja California'),
('STU-007', 'Mateo', 'Sánchez Morales', 'mateo.sanchez@email.com', '1998-12-03', 'MEX', 'León', 'Guanajuato'),
('STU-008', 'Isabella', 'Cruz Mendoza', 'isabella.cruz@email.com', '1999-04-25', 'MEX', 'Mérida', 'Yucatán'),
('STU-009', 'Sebastián', 'Torres Vargas', 'sebastian.t@email.com', '1997-08-12', 'MEX', 'Ciudad de México', 'CDMX'),
('STU-010', 'Renata', 'Morales Jiménez', 'renata.morales@email.com', '2000-06-07', 'MEX', 'Guadalajara', 'Jalisco'),
('STU-011', 'Emiliano', 'Jiménez Castillo', 'emiliano.j@email.com', '1998-02-19', 'COL', 'Bogotá', 'Cundinamarca'),
('STU-012', 'Lucía', 'Vargas Díaz', 'lucia.vargas@email.com', '1999-10-31', 'MEX', 'Cancún', 'Quintana Roo'),
('STU-013', 'Daniel', 'Castillo Ruiz', 'daniel.castillo@email.com', '1996-07-04', 'MEX', 'Ciudad de México', 'CDMX'),
('STU-014', 'Fernanda', 'Mendoza López', 'fernanda.m@email.com', '2001-03-28', 'ARG', 'Buenos Aires', 'Buenos Aires'),
('STU-015', 'Santiago', 'Ruiz García', 'santiago.ruiz@email.com', '1997-01-15', 'MEX', 'Querétaro', 'Querétaro');

-- ════════════════════════════════════════════════════════════
-- DATOS INICIALES: ENROLLMENTS
-- ════════════════════════════════════════════════════════════
INSERT INTO enrollments (id_student, id_course, enrollment_date, grade, status, completion_date) VALUES
('STU-001', 1, '2026-01-10 08:30:00', 9.50, 'COMPLETED', '2026-03-15 14:00:00'),
('STU-001', 2, '2026-03-20 09:00:00', 8.00, 'IN_PROGRESS', NULL),
('STU-001', 3, '2026-06-01 10:00:00', NULL, 'ENROLLED', NULL),
('STU-002', 1, '2026-01-12 11:00:00', 10.00, 'COMPLETED', '2026-03-10 16:00:00'),
('STU-002', 4, '2026-02-01 09:30:00', 9.00, 'COMPLETED', '2026-03-20 15:00:00'),
('STU-002', 2, '2026-04-01 08:00:00', 7.50, 'IN_PROGRESS', NULL),
('STU-003', 6, '2026-02-15 10:00:00', 8.50, 'COMPLETED', '2026-04-10 17:00:00'),
('STU-003', 7, '2026-04-15 09:00:00', NULL, 'IN_PROGRESS', NULL),
('STU-004', 8, '2026-01-20 08:00:00', 9.00, 'COMPLETED', '2026-04-01 14:30:00'),
('STU-004', 9, '2026-04-05 10:30:00', 8.00, 'IN_PROGRESS', NULL),
('STU-004', 1, '2026-05-01 09:00:00', NULL, 'ENROLLED', NULL),
('STU-005', 10, '2026-02-01 11:00:00', 7.00, 'COMPLETED', '2026-05-20 16:00:00'),
('STU-005', 4, '2026-01-15 08:30:00', 8.50, 'COMPLETED', '2026-03-01 15:00:00'),
('STU-006', 1, '2026-01-18 09:00:00', 8.00, 'COMPLETED', '2026-03-25 14:00:00'),
('STU-006', 11, '2026-04-01 10:00:00', NULL, 'IN_PROGRESS', NULL),
('STU-007', 2, '2026-03-01 08:00:00', 9.00, 'COMPLETED', '2026-04-15 16:30:00'),
('STU-007', 3, '2026-04-20 09:30:00', 8.50, 'IN_PROGRESS', NULL),
('STU-007', 12, '2026-07-01 10:00:00', NULL, 'ENROLLED', NULL),
('STU-008', 4, '2026-02-10 08:00:00', 9.50, 'COMPLETED', '2026-03-15 15:00:00'),
('STU-008', 5, '2026-03-20 09:00:00', 8.00, 'IN_PROGRESS', NULL),
('STU-009', 1, '2026-01-25 10:00:00', 7.50, 'COMPLETED', '2026-04-01 14:00:00'),
('STU-009', 2, '2026-04-10 08:30:00', NULL, 'IN_PROGRESS', NULL),
('STU-010', 8, '2026-02-05 09:00:00', 9.00, 'COMPLETED', '2026-05-01 16:00:00'),
('STU-010', 6, '2026-05-10 10:00:00', NULL, 'ENROLLED', NULL),
('STU-011', 3, '2026-03-15 08:00:00', 8.00, 'IN_PROGRESS', NULL),
('STU-011', 11, '2026-06-01 09:30:00', NULL, 'ENROLLED', NULL),
('STU-012', 1, '2026-02-01 10:00:00', 9.00, 'COMPLETED', '2026-04-10 15:30:00'),
('STU-012', 4, '2026-04-15 08:00:00', NULL, 'IN_PROGRESS', NULL),
('STU-013', 12, '2026-03-01 09:00:00', 8.50, 'IN_PROGRESS', NULL),
('STU-013', 6, '2026-01-20 10:30:00', 9.00, 'COMPLETED', '2026-03-15 14:00:00');

-- ════════════════════════════════════════════════════════════
-- VERIFICACIÓN
-- ════════════════════════════════════════════════════════════
SELECT '════ LEARNHUB - DATOS CARGADOS ════' AS '';

SELECT 'levels' AS tabla, COUNT(*) AS registros FROM levels
UNION ALL SELECT 'categories', COUNT(*) FROM categories
UNION ALL SELECT 'instructors', COUNT(*) FROM instructors
UNION ALL SELECT 'courses', COUNT(*) FROM courses
UNION ALL SELECT 'instructors_courses', COUNT(*) FROM instructors_courses
UNION ALL SELECT 'modules', COUNT(*) FROM modules
UNION ALL SELECT 'students', COUNT(*) FROM students
UNION ALL SELECT 'enrollments', COUNT(*) FROM enrollments;

-- Total de registros
SELECT CONCAT('Total: ',
    (SELECT COUNT(*) FROM levels) +
    (SELECT COUNT(*) FROM categories) +
    (SELECT COUNT(*) FROM instructors) +
    (SELECT COUNT(*) FROM courses) +
    (SELECT COUNT(*) FROM instructors_courses) +
    (SELECT COUNT(*) FROM modules) +
    (SELECT COUNT(*) FROM students) +
    (SELECT COUNT(*) FROM enrollments),
    ' registros en 8 tablas'
) AS resumen;