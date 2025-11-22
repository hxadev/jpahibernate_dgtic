package com.dgtic.unam;

import com.dgtic.unam.repository.BookRepository;
import com.dgtic.unam.repository.BookRepositoryImpl;
import com.dgtic.unam.service.BookstoreService;
import com.dgtic.unam.model.Book;
import com.dgtic.unam.dao.BookstoreDAO;

import java.util.List;
/**
 * Clase principal para ejecutar la aplicación de la librería.
 */
public class Main {
    public static void main(String[] args) {
        BookstoreDAO bookstoreDAO = new BookstoreDAO();
        BookstoreService client = new BookstoreService(bookstoreDAO);

        BookRepository bookRepository = new BookRepositoryImpl();

        // FindAllBooks
        List<Book> books= bookRepository.findAll();
        books.forEach(System.out::println);

        // Find by Publisher Code
        bookRepository.findByPublisherCode("P003").forEach(System.out::println);

        // Find by Name Pattern
        bookRepository.findByNamePattern("%Java%").forEach(System.out::println);


    }
}