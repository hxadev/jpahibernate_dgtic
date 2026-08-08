# 📦 pom.xml — Proyecto LearnHub

> Copiar este archivo como `pom.xml` en la raíz de tu proyecto Maven.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>mx.unam.dgtic</groupId>
    <artifactId>learnhub</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>jar</packaging>

    <name>LearnHub</name>
    <description>
        Plataforma de Cursos Online — Módulo 3: Persistencia con Hibernate
        Diplomado Java Ed. 20 — DGTIC-UNAM
    </description>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>

        <hibernate.version>6.4.4.Final</hibernate.version>
        <jakarta.persistence.version>3.1.0</jakarta.persistence.version>
        <mariadb.version>3.3.3</mariadb.version>
        <lombok.version>1.18.30</lombok.version>
        <junit.version>5.10.2</junit.version>
    </properties>

    <dependencies>

        <!-- ═══ HIBERNATE / JPA ═══ -->
        <dependency>
            <groupId>org.hibernate.orm</groupId>
            <artifactId>hibernate-core</artifactId>
            <version>${hibernate.version}</version>
        </dependency>

        <dependency>
            <groupId>jakarta.persistence</groupId>
            <artifactId>jakarta.persistence-api</artifactId>
            <version>${jakarta.persistence.version}</version>
        </dependency>

        <!-- ═══ VALIDACIONES ═══ -->
        <dependency>
            <groupId>org.hibernate.validator</groupId>
            <artifactId>hibernate-validator</artifactId>
            <version>8.0.1.Final</version>
        </dependency>

        <dependency>
            <groupId>org.glassfish.expressly</groupId>
            <artifactId>expressly</artifactId>
            <version>5.0.0</version>
        </dependency>

        <!-- ═══ BASE DE DATOS ═══ -->
        <dependency>
            <groupId>org.mariadb.jdbc</groupId>
            <artifactId>mariadb-java-client</artifactId>
            <version>${mariadb.version}</version>
        </dependency>

        <!-- ═══ LOGGING ═══ -->
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-simple</artifactId>
            <version>2.0.12</version>
        </dependency>

        <!-- ═══ LOMBOK ═══ -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>${lombok.version}</version>
            <scope>provided</scope>
        </dependency>

        <!-- ═══ TESTING ═══ -->
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <version>${junit.version}</version>
            <scope>test</scope>
        </dependency>

    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.12.1</version>
                <configuration>
                    <source>17</source>
                    <target>17</target>
                    <annotationProcessorPaths>
                        <path>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                            <version>${lombok.version}</version>
                        </path>
                    </annotationProcessorPaths>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

---

## persistence.xml

Crear en `src/main/resources/META-INF/persistence.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<persistence xmlns="https://jakarta.ee/xml/ns/persistence"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="https://jakarta.ee/xml/ns/persistence
             https://jakarta.ee/xml/ns/persistence/persistence_3_1.xsd"
             version="3.1">

    <persistence-unit name="learnhubPU" transaction-type="RESOURCE_LOCAL">
        <properties>
            <!-- Conexión a MariaDB -->
            <property name="jakarta.persistence.jdbc.url"
                      value="jdbc:mariadb://localhost:3306/learnhub"/>
            <property name="jakarta.persistence.jdbc.user"
                      value="root"/>
            <property name="jakarta.persistence.jdbc.password"
                      value="CAMBIA_POR_TU_PASSWORD"/>
            <property name="jakarta.persistence.jdbc.driver"
                      value="org.mariadb.jdbc.Driver"/>

            <!-- Hibernate Config -->
            <property name="hibernate.dialect"
                      value="org.hibernate.dialect.MariaDBDialect"/>
            <property name="hibernate.hbm2ddl.auto"
                      value="update"/>
            <property name="hibernate.show_sql"
                      value="true"/>
            <property name="hibernate.format_sql"
                      value="true"/>
            <property name="hibernate.highlight_sql"
                      value="true"/>
        </properties>
    </persistence-unit>
</persistence>
```

> ⚠️ **Cambia `CAMBIA_POR_TU_PASSWORD` por tu contraseña real de MariaDB.**

---

> **Módulo 3: Persistencia con Hibernate** | Diplomado Java Ed. 20 | DGTIC-UNAM | [hxadev.tech](http://hxadev.tech)