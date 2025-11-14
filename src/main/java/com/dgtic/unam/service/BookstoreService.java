package com.dgtic.unam.service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object (DAO) for Bookstore operations.
 */
public class BookstoreService {
    private Connection connection;

    public BookstoreService(Connection connection) {
        this.connection = connection;
    }

    public BookstoreService(){
        connection = null;
    }

    public void insertBook(Book book) {
        try{
            // 1. Load Driver
            Class.forName("org.mariadb.jdbc.Driver");
            String DBNAME = "bookstore";
            String URL = "jdbc:mariadb://localhost:3307/"+DBNAME;
            String USER = "dgtic";
            String PASS = "dgtic1234";

            // 2. Create Connection
            connection = java.sql.DriverManager.getConnection(URL, USER, PASS);

            // 3. Create Statement
            PreparedStatement stmt=connection.prepareStatement("INSERT INTO BOOK(isbn, book_name, publisher_code) VALUES(?,?,?)");
            stmt.setString(1, book.getIsbn());
            stmt.setString(2, book.getBookName());
            stmt.setString(3, book.getPublisherCode());

            // 4. Execute Statement(Query)
            stmt.executeUpdate();

            // 5. Close Statement
            stmt.close();

        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        catch (SQLException e) {
            e.printStackTrace();
        } finally {
            if (connection != null) {
                try {
                    connection.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    public List<Book> findAllBooks() {
        // Implementation for retrieving all books from the database
        List<Book> books = new ArrayList<Book>();
        try{
            // 1. Load Driver
            Class.forName("org.mariadb.jdbc.Driver");

            // 2. Create Connection
            connection = this.buildConnection();

            // 3. Create Statement(Query)
            var sql="SELECT isbn, book_name, publisher_code FROM BOOK";
            try(PreparedStatement stmt=connection.prepareStatement(sql)){
                // 4. Execute Statement(Query)
                ResultSet rs=stmt.executeQuery();

                // 5. Process ResultSet
                while(rs.next()){
                    String isbn=rs.getString("isbn");
                    String bookName=rs.getString("book_name");
                    String publisherCode=rs.getString("publisher_code");
                    books.add(new Book(isbn,bookName,publisherCode));
                }
            } // 6. Close Statement


            return books;

        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        catch (SQLException e) {
            e.printStackTrace();
        } finally {
            if (connection != null) {
                try {
                    connection.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
        return books;
    }

    public Book findBookByIsbn(String isbn) {
        // Implementation for retrieving a book by its ISBN from the database
        Book book = null;
        try{
            Class.forName("org.mariadb.jdbc.Driver");
            connection = this.buildConnection();

            var sql="SELECT isbn, book_name, publisher_code FROM BOOK WHERE isbn = ?";
            try(PreparedStatement stmt=connection.prepareStatement(sql)){
                stmt.setString(1, isbn);
                ResultSet rs=stmt.executeQuery();

                if(rs.next()){
                    String bookName=rs.getString("book_name");
                    String publisherCode=rs.getString("publisher_code");
                    book = new Book(isbn,bookName,publisherCode);
                }
            }
            return book;

        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        catch (SQLException e) {
            e.printStackTrace();
        } finally {
            if (connection != null) {
                try {
                    connection.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
        return book;
    }

    private Connection buildConnection() throws SQLException {
        String DBNAME = "bookstore";
        String URL = "jdbc:mariadb://localhost:3307/"+DBNAME;
        String USER = "dgtic";
        String PASS = "dgtic1234";
        return java.sql.DriverManager.getConnection(URL, USER, PASS);
    }

}
