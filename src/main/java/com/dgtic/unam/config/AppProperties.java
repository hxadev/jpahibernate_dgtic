package com.dgtic.unam.config;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 * Singleton  AppProperties
 */
public class AppProperties {
    private static AppProperties instance;
    private final Properties properties = new Properties();

    private AppProperties() {
        try (InputStream is = getClass().getClassLoader().getResourceAsStream("application.properties")) {
            if (is == null) {
                throw new IllegalStateException("application.properties not found");
            }
            properties.load(is);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public static AppProperties getInstance() {
        if (instance == null) {
            instance = new AppProperties();
        }
        return instance;
    }

    public String get(String key){
        return properties.getProperty(key);
    }


}
