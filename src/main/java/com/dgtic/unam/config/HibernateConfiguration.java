package com.dgtic.unam.config;

import com.dgtic.unam.model.Book;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.AvailableSettings;
import org.hibernate.cfg.Configuration;

public class HibernateConfiguration {
    public static SessionFactory buildSessionFactory() {
        return new Configuration()
                .addAnnotatedClass(Book.class)
                .setProperty(AvailableSettings.JAKARTA_JDBC_DRIVER,"org.mariadb.jdbc.Driver")
                .setProperty(AvailableSettings.JAKARTA_JDBC_URL,"jdbc:mariadb://localhost:3307/bookstore")
                .setProperty(AvailableSettings.JAKARTA_JDBC_USER,"dgtic")
                .setProperty(AvailableSettings.JAKARTA_JDBC_PASSWORD,"dgtic1234")
                .setProperty(AvailableSettings.SHOW_SQL, Boolean.TRUE)
                .setProperty(AvailableSettings.FORMAT_SQL, Boolean.TRUE)
                .setProperty(AvailableSettings.HIGHLIGHT_SQL, Boolean.TRUE)
                .buildSessionFactory();
    }
}
