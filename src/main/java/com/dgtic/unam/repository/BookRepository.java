package com.dgtic.unam.repository;

import com.dgtic.unam.model.Book;

import java.util.List;

public interface BookRepository {
    List<Book> findAll();
    Book findByIsbn(String isbn);
    Book findByName(String name);
    List<Book> findByPublisherCode(String code);
    List<Book> findByNamePattern(String pattern);
    List<Book> findByPublicationYearRange(int startYear, int endYear);
    List<Book> findByAuthorCountry(String country);
    List<Book> findBooksWithChapterCountGreaterThan(int minCount);
    List<Book> findDynamic(String isbn,
                           String nameContains,
                           String publisherCode,
                           Integer yearFrom,
                           Integer yearTo,
                           String authorCountry);

 }
