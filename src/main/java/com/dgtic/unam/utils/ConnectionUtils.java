package com.dgtic.unam.utils;

import com.dgtic.unam.config.AppProperties;

import java.sql.Connection;
import java.sql.SQLException;

public class ConnectionUtils {
    public static Connection buildConnection() throws SQLException {
        AppProperties properties = AppProperties.getInstance();
        // 1. Load Driver
        String DBNAME = properties.get("db.name");
        String URL = properties.get("db.url");
        String USER = properties.get("db.user");
        String PASS = properties.get("db.password");

        return java.sql.DriverManager.getConnection(URL, USER, PASS);
    }
}
