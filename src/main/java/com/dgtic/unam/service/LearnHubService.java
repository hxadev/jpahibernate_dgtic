package com.dgtic.unam.service;

import com.dgtic.unam.config.AppProperties;

import java.awt.print.Book;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

/**
 * Data Access Object (DAO) for LearnHub operations.
 */
public class LearnHubService {
    private Connection connection;

    public LearnHubService(Connection connection) {
        this.connection = connection;
    }

    public LearnHubService() {
        connection = null;
    }

    public void insertCourse(Course course) {
        try {
            Class.forName("org.mariadb.jdbc.Driver");

            // 2. Create Connection
            connection = buildConnection();

            // 3. Create Statement
            PreparedStatement stmt = connection.prepareStatement("INSERT INTO courses (title, description, price, duration, active, created_at, updated_at, ranking, level_id, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            stmt.setString(1, course.title());
            stmt.setString(2, course.description());
            stmt.setDouble(3, course.price());
            stmt.setDouble(4, course.duration());
            stmt.setBoolean(5, course.active());
            stmt.setTimestamp(6, new java.sql.Timestamp(course.createdAt().getTime()));
            stmt.setTimestamp(7, new java.sql.Timestamp(course.updatedAt().getTime()));
            stmt.setInt(8, course.ranking());
            stmt.setInt(9, course.level_id());
            stmt.setInt(10, course.category_id());

            // 4. Execute Statement(Query)
            stmt.executeUpdate();

            // 5. Close Statement
            stmt.close();

        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (SQLException e) {
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

    public List<Course> findAllCourses() {
        // Implementation for retrieving all courses from the database
        List<Course> courses = new ArrayList<Course>();
        try {
            // 1. Load Driver
            Class.forName("org.mariadb.jdbc.Driver");

            // 2. Create Connection
            connection = this.buildConnection();

            // 3. Create Statement(Query)
            var sql = "SELECT *  FROM courses";
            try (PreparedStatement stmt = connection.prepareStatement(sql)) {
                // 4. Execute Statement(Query)
                ResultSet rs = stmt.executeQuery();

                // 5. Process ResultSet
                while (rs.next()) {
                    int id = rs.getInt("id");
                    String title = rs.getString("title");
                    String description = rs.getString("description");
                    double price = rs.getDouble("price");
                    int duration = rs.getInt("duration");
                    boolean active = rs.getBoolean("active");
                    Timestamp createdAt = rs.getTimestamp("created_at");
                    Timestamp updatedAt = rs.getTimestamp("updated_at");
                    short ranking = rs.getShort("ranking");
                    int level_id = rs.getInt("level_id");
                    int category_id = rs.getInt("category_id");

                    courses.add(new Course(id, title, description, price, duration, active, createdAt, updatedAt, ranking, level_id, category_id));
                }
            } // 6. Close Statement


            return courses;

        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (SQLException e) {
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
        return courses;
    }

    public Course findCourseById(int id) {
        // Implementation for retrieving a course by its id from the database
        Course course = null;
        try {
            Class.forName("org.mariadb.jdbc.Driver");
            connection = this.buildConnection();

            var sql = "SELECT * FROM courses WHERE id = ?";
            try (PreparedStatement stmt = connection.prepareStatement(sql)) {
                stmt.setInt(1, id);
                ResultSet rs = stmt.executeQuery();

                if (rs.next()) {

                    String title = rs.getString("title");
                    String description = rs.getString("description");
                    double price = rs.getDouble("price");
                    int duration = rs.getInt("duration");
                    boolean active = rs.getBoolean("active");
                    Timestamp createdAt = rs.getTimestamp("created_at");
                    Timestamp updatedAt = rs.getTimestamp("updated_at");
                    short ranking = rs.getShort("ranking");
                    int level_id = rs.getInt("level_id");
                    int category_id = rs.getInt("category_id");

                    course = new Course(id, title, description, price, duration, active, createdAt, updatedAt, ranking, level_id, category_id);
                }
            }
            return course;

        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (SQLException e) {
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
        return course;
    }

    private Connection buildConnection() throws SQLException {
        AppProperties properties = AppProperties.getInstance();
        // 1. Load Driver
        String DBNAME = properties.get("db.name");
        String URL = properties.get("db.url");
        String USER = properties.get("db.user");
        String PASS = properties.get("db.password");

        return java.sql.DriverManager.getConnection(URL, USER, PASS);
    }

}
