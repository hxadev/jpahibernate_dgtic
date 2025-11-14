package com.dgtic.unam;

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

        // Step Get all Books
        List<Book> books= client.findAllBooks();
        for (Book book : books) {
            System.out.println("Book: " + book.getBookName() + ", ISBN: " + book.getIsbn() + ", Publisher Code: " + book.getPublisherCode());
        }

        // Step Find a Book by ISBN
        String searchIsbn = "ISBN-002";
        Book foundBook = client.findBookByIsbn(searchIsbn);
        if (foundBook != null) {
            System.out.println("Found Book: " + foundBook.getBookName() + ", ISBN: " + foundBook.getIsbn() + ", Publisher Code: " + foundBook.getPublisherCode());
        } else {
            System.out.println("Book with ISBN " + searchIsbn + " not found.");
        }

        // Step Insert a new Book
        //Book newBook = new Book("ISBN-005", "New Book Title", "P001");
        //client.insertBook(newBook);




    }
}