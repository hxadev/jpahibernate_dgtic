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
            System.out.println("Book: " + book.getBookName() + ", ISBN: " + book.getIsbn() + ", Publisher Code: " + book.getPublisher()+", Detail: "+book.getDetail()+", Chapters: "+book.getChapters());
        }

    }
}