/***************************************************************
 * SERVIDOR: MariaDB
 * BASE DE DATOS: Bookstore
 * 
 * DESCRIPCIÓN:
 * Base de datos de ejemplo para prácticas educativas relacionadas
 * con JDBC, ORM, Hibernate, JPA y modelado relacional.
 *
 ****************************************************************/

-- 1. ELIMINAR Y CREAR LA BASE ---------------------------------
DROP DATABASE IF EXISTS bookstore;
CREATE DATABASE bookstore;

USE bookstore;


-- 2. TABLA: PUBLISHER (EDITORIAL) ------------------------------
CREATE TABLE PUBLISHER (
    CODE VARCHAR(4) NOT NULL,
    PUBLISHER_NAME VARCHAR(100) NOT NULL,
    PRIMARY KEY (CODE)
);


-- 3. TABLA: BOOK (LIBRO) ---------------------------------------
CREATE TABLE BOOK (
    ISBN VARCHAR(50) NOT NULL,
    BOOK_NAME VARCHAR(100) NOT NULL,
    PUBLISHER_CODE VARCHAR(4),
    PRIMARY KEY (ISBN),
    CONSTRAINT FK_BOOK_PUBLISHER
      FOREIGN KEY (PUBLISHER_CODE) REFERENCES PUBLISHER (CODE)
);


-- 4. TABLA: CHAPTER (CAPÍTULO) ---------------------------------
CREATE TABLE CHAPTER (
    BOOK_ISBN VARCHAR(50) NOT NULL,
    CHAPTER_NUM INT NOT NULL,
    TITLE VARCHAR(100) NOT NULL,
    PRIMARY KEY (BOOK_ISBN, CHAPTER_NUM),
    CONSTRAINT FK_CHAPTER_BOOK
      FOREIGN KEY (BOOK_ISBN) REFERENCES BOOK (ISBN)
);


-- 5. INSERTS DE PRUEBA -----------------------------------------

-- Editoriales
INSERT INTO PUBLISHER (CODE, PUBLISHER_NAME) VALUES
('P001', 'Penguin Random House'),
('P002', 'HarperCollins'),
('P003', 'OReilly Media'),
('P004', 'Pearson Education');

-- Libros
INSERT INTO BOOK (ISBN, BOOK_NAME, PUBLISHER_CODE) VALUES
('ISBN-001', 'Java Fundamentals', 'P004'),
('ISBN-002', 'Mastering Hibernate', 'P003'),
('ISBN-003', 'Spring Boot in Action', 'P002'),
('ISBN-004', 'Clean Code', 'P001');

-- Capítulos de "Java Fundamentals"
INSERT INTO CHAPTER (BOOK_ISBN, CHAPTER_NUM, TITLE) VALUES
('ISBN-001', 1, 'Introduction to Java'),
('ISBN-001', 2, 'Object Oriented Programming'),
('ISBN-001', 3, 'Collections Framework');

-- Capítulos de "Mastering Hibernate"
INSERT INTO CHAPTER (BOOK_ISBN, CHAPTER_NUM, TITLE) VALUES
('ISBN-002', 1, 'What Is ORM'),
('ISBN-002', 2, 'Hibernate Architecture'),
('ISBN-002', 3, 'Entity Mapping Basics');

-- Capítulos de "Spring Boot in Action"
INSERT INTO CHAPTER (BOOK_ISBN, CHAPTER_NUM, TITLE) VALUES
('ISBN-003', 1, 'Spring Framework Overview'),
('ISBN-003', 2, 'REST Controllers'),
('ISBN-003', 3, 'Data Persistence');

-- Capítulos de "Clean Code"
INSERT INTO CHAPTER (BOOK_ISBN, CHAPTER_NUM, TITLE) VALUES
('ISBN-004', 1, 'Meaningful Names'),
('ISBN-004', 2, 'Functions'),
('ISBN-004', 3, 'Code Smells');


-- 6. PERMISOS PARA USUARIO DEL CURSO ---------------------------


-- FIN DEL SCRIPT ------------------------------------------------
