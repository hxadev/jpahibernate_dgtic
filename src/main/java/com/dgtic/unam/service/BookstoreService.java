package com.dgtic.unam.service;

import com.dgtic.unam.model.Book;
import com.dgtic.unam.dao.BookstoreDAO;

import java.util.List;

/**
 * Cliente para interactuar con la librería a través del DAO.
 */
public class BookstoreService {
    private BookstoreDAO bookstoreDAO;

    public BookstoreService(BookstoreDAO bookstoreDAO) {
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
