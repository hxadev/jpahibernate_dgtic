package com.dgtic.unam.client;

import com.dgtic.unam.model.Book;
import com.dgtic.unam.dao.BookstoreDAO;

import java.util.List;

/**
 * Cliente para interactuar con la librería a través del DAO.
 */
public class BookstoreClient {
    private BookstoreDAO bookstoreDAO;

    public BookstoreClient(BookstoreDAO bookstoreDAO) {
        this.bookstoreDAO = bookstoreDAO;
    }

    public Book findBookByIsbn(String isbn) {
        return bookstoreDAO.findBookByIsbn(isbn);
    }

    public List<Book> findAllBooks() {
        return bookstoreDAO.findAllBooks();
    }

    public void insertBook(Book book) {
        bookstoreDAO.insertBook(book);
        System.out.println("Book inserted: " + book.getBookName());
    }
}
