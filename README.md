# Bookstore Service

A simple Java service that manages books using JDBC and MariaDB. Includes operations to insert and retrieve records from the `book` table.

## Requirements

- Java 17+ (JDK)
- Maven
- MariaDB (or MySQL-compatible) accessible at `localhost:3307`
- MariaDB JDBC driver: `org.mariadb.jdbc:mariadb-java-client`
- Database: `bookstore`
- Table: `book` with columns `isbn`, `book_name`, `publisher_code`

## Setup Driver

### Manual Loading of MariaDB Driver
- Download the MariaDB JDBC driver from the [MariaDB Connector/J page](https://mariadb.com/kb/en/about-mariadb-connector-j/).
- Load the library manually in your project.

### Maven Dependency
Add the following dependency to your `pom.xml`:
```xml
<dependency>
    <groupId>org.mariadb.jdbc</groupId>
    <artifactId>mariadb-java-client</artifactId>
    <version>3.4.1</version>
</dependency>
```
Ref: [MariaDB Connector/J Documentation](https://mariadb.com/docs/connectors/mariadb-connector-j/java-connector-using-maven)