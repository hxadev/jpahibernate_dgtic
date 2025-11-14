package com.dgtic.unam;

import com.dgtic.unam.service.Book;
import com.dgtic.unam.service.BookstoreService;

import java.util.List;
/**
 * Clase principal para ejecutar la aplicación de la librería.
 */
public class Main {
    public static void main(String[] args) {
        BookstoreService service = new BookstoreService();

        // Step Get all Books
        List<Book> books= service.findAllBooks();
        for (Book book : books) {
            System.out.println("Book: " + book.getBookName() + ", ISBN: " + book.getIsbn() + ", Publisher Code: " + book.getPublisherCode());
        }

        // Step Find a Book by ISBN
        String searchIsbn = "ISBN-002";
        Book foundBook = service.findBookByIsbn(searchIsbn);
        if (foundBook != null) {
            System.out.println("Found Book: " + foundBook.getBookName() + ", ISBN: " + foundBook.getIsbn() + ", Publisher Code: " + foundBook.getPublisherCode());
        } else {
            System.out.println("Book with ISBN " + searchIsbn + " not found.");
        }

        // Step Insert a new Book
        //Book newBook = new Book("ISBN-005", "New Book Title", "P001");
        //service.insertBook(newBook);




    }
}