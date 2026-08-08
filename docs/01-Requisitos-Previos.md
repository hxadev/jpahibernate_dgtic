# 📋 Requisitos Previos — Módulo 3: Persistencia con Hibernate

> **Diplomado Desarrollo de Sistemas con Tecnología Java — Edición 20** 
> DGTIC-UNAM | Instructor: Alfonso Hernández Xochipa | [hxadev.tech](http://hxadev.tech)

---

## 1. Conocimientos Previos Requeridos

Para aprovechar al máximo este módulo, necesitas dominar los siguientes temas de los módulos anteriores:

### Del Módulo 1 — Programación Orientada a Objetos con Java
- Clases, objetos, constructores
- Herencia y polimorfismo
- Interfaces y clases abstractas
- Colecciones (List, Map, Set)
- Genéricos
- Anotaciones (fundamentos)
- Expresiones lambda (básico)
- Enums

### Del Módulo 2 — Manejo de Bases de Datos con Java
- Modelo relacional (tablas, PKs, FKs, constraints)
- SQL: DDL (CREATE, ALTER, DROP)
- SQL: DML (INSERT, UPDATE, DELETE, SELECT)
- SQL: JOINs, GROUP BY, ORDER BY
- API JDBC (Connection, Statement, ResultSet)
- Gestión de excepciones y recursos en JDBC

### Conceptos Generales
- Estructura de proyectos Maven (pom.xml, dependencias)
- Git básico (clone, add, commit, push)
- Uso de IntelliJ IDEA (crear proyecto, ejecutar, debug)

---

## 2. Software Obligatorio

| Software | Versión | Descarga | Notas |
|----------|---------|----------|-------|
| **OpenJDK** | 17.0.2+ | [jdk.java.net/17](https://jdk.java.net/17/) | Verificar: `java -version` |
| **IntelliJ IDEA Community** | 2024.x+ | [jetbrains.com/idea](https://www.jetbrains.com/es-es/idea/download/) | Para módulos de Jakarta usar licencia 120 días |
| **MariaDB Server** | 10.6.7 o 10.7.3 | [mariadb.org/download](https://mariadb.org/download/) | O MySQL 8.0+ |
| **Maven** | 3.9+ | [maven.apache.org](https://maven.apache.org/) | Integrado en IntelliJ |
| **Git** | 2.x+ | [git-scm.com](https://git-scm.com/) | Control de versiones |
| **Postman** | Última | [postman.com/downloads](https://www.postman.com/downloads/) | Para probar APIs REST |
| **DBeaver** (Opcional) | Última | [dbeaver.io](https://dbeaver.io/download/) | Cliente visual de BD |

---

## 3. Herramientas de IA

### Filosofía del módulo

> **La IA explica el problema → tú entiendes → tú escribes tu propia solución.**

La IA es un asistente de aprendizaje, no un generador de respuestas.

### GitHub Copilot Free (Obligatorio)

| Aspecto | Detalle |
|---------|---------|
| **Qué es** | Asistente de código con IA integrado en IntelliJ IDEA |
| **Plan Free** | 2,000 sugerencias de autocompletado + chat por mes |
| **Requisitos** | Cuenta de GitHub (gratuita) + plugin en IntelliJ |
| **Instalación** | IntelliJ → Settings → Plugins → "GitHub Copilot" → Install → Login |

**Usos permitidos en clase:**
- ✅ Preguntar: *"¿Qué hace la anotación @ManyToOne?"*
- ✅ Pedir: *"Explica este error de mapeo"*
- ✅ Explorar: *"¿Qué opciones tiene CascadeType?"*
- ✅ Generar datos de prueba
- ✅ Entender código existente

**Usos NO permitidos:**
- ❌ Copiar/pegar código generado sin entenderlo
- ❌ Pedir que resuelva ejercicios completos
- ❌ Entregar código que no puedes explicar

### Otras herramientas (Opcionales)

| Herramienta | Acceso | Uso principal |
|-------------|--------|---------------|
| Claude (claude.ai) | Navegador | Explicaciones detalladas, debug |
| ChatGPT Free | Navegador | Consultas generales |

---

## 4. Dependencias Maven del Módulo

Estas dependencias se agregan al `pom.xml`. Maven las descarga automáticamente.

```xml
<dependencies>
    <!-- Hibernate Core -->
    <dependency>
        <groupId>org.hibernate.orm</groupId>
        <artifactId>hibernate-core</artifactId>
        <version>6.4.4.Final</version>
    </dependency>

    <!-- Jakarta Persistence API -->
    <dependency>
        <groupId>jakarta.persistence</groupId>
        <artifactId>jakarta.persistence-api</artifactId>
        <version>3.1.0</version>
    </dependency>

    <!-- Hibernate Validator (Bean Validation) -->
    <dependency>
        <groupId>org.hibernate.validator</groupId>
        <artifactId>hibernate-validator</artifactId>
        <version>8.0.1.Final</version>
    </dependency>

    <!-- Expression Language (requerido por Validator) -->
    <dependency>
        <groupId>org.glassfish.expressly</groupId>
        <artifactId>expressly</artifactId>
        <version>5.0.0</version>
    </dependency>

    <!-- Driver MariaDB -->
    <dependency>
        <groupId>org.mariadb.jdbc</groupId>
        <artifactId>mariadb-java-client</artifactId>
        <version>3.3.3</version>
    </dependency>

    <!-- Logging -->
    <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-simple</artifactId>
        <version>2.0.12</version>
    </dependency>

    <!-- Lombok (reducir boilerplate) -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>1.18.30</version>
        <scope>provided</scope>
    </dependency>

    <!-- JUnit 5 -->
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter</artifactId>
        <version>5.10.2</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

---

## 5. Base de Datos

Antes de la primera sesión, asegúrate de tener MariaDB funcionando:

```bash
# 1. Verificar que el servicio está corriendo
mysql -u root -p

# 2. Crear la base de datos del módulo
CREATE DATABASE learnhub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 3. Verificar
SHOW DATABASES;
```

### Proyecto: LearnHub — Plataforma de Cursos Online

El módulo utiliza un sistema de gestión de cursos como ejemplo práctico.

**Entidades:**
- `categories` — Categorías de cursos
- `instructors` — Instructores
- `courses` — Cursos
- `modules` — Módulos de cada curso
- `students` — Estudiantes
- `enrollments` — Inscripciones (N:M con atributos)
- `levels` — Niveles (Beginner, Intermediate, Advanced)

---

## 6. Cuenta de GitHub

Necesitarás una cuenta de GitHub (gratuita) para:

- ✅ Activar GitHub Copilot Free
- ✅ Versionar tu proyecto del módulo
- ✅ Entregar avances del proyecto
- ✅ Colaborar con compañeros

**Registrate en:** [github.com](https://github.com)

---

## 7. Verificación Final

Antes de la primera sesión, verifica que todo funciona:

```
✅ java -version          →  17.0.x
✅ mvn -version           →  3.9.x
✅ git --version          →  2.x
✅ mysql -u root -p       →  Conexión exitosa
✅ IntelliJ IDEA          →  Abre correctamente
✅ GitHub Copilot         →  Status: Ready en IntelliJ
✅ Base de datos          →  learnhub creada
```

Si alguno falla, consulta la **Guía de Configuración del Entorno** o contacta al instructor.

---

> **Módulo 3: Persistencia con Hibernate** | 20 horas (4 sesiones × 5 hrs)
> Diplomado Java Ed. 20 | DGTIC-UNAM | [hxadev.tech](http://hxadev.tech)