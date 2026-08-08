# 🛠️ Guía de Configuración del Entorno de Desarrollo

> **Diplomado Desarrollo de Sistemas con Tecnología Java — Edición 20**
> Módulo 3: Persistencia con Hibernate
> DGTIC-UNAM | Instructor: Alfonso Hernández Xochipa | [hxadev.tech](http://hxadev.tech)

---

## Paso 1: Instalar OpenJDK 17

### Windows

1. Descargar OpenJDK 17 de [jdk.java.net/17](https://jdk.java.net/java-se-ri/17-MR1) (archivo `.zip`)
2. Extraer en `C:\Program Files\Java\jdk-17.0.2`
3. Configurar variable de entorno:
   - `JAVA_HOME` = `C:\Program Files\Java\jdk-17.0.2`
   - Agregar `%JAVA_HOME%\bin` al `PATH`
4. Verificar:

```cmd
java -version
# openjdk version "17.0.2" ...
```

### macOS

```bash
brew install openjdk@17
sudo ln -sfn $(brew --prefix openjdk@17)/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk
java -version
```

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install openjdk-17-jdk
java -version
```

---

## Paso 2: Instalar IntelliJ IDEA Community Edition

1. Descargar desde [jetbrains.com/idea/download](https://www.jetbrains.com/es-es/idea/download/)
2. Seleccionar **Community Edition** (gratuita)
3. Ejecutar instalador → siguiente → siguiente → finalizar
4. Abrir IntelliJ y completar la configuración inicial
5. Verificar Maven integrado:
   - `File` → `Settings` → `Build, Execution, Deployment` → `Build Tools` → `Maven`
   - Debe mostrar la versión de Maven bundled

### Configuración recomendada

```
File → Settings → Editor → General → Auto Import
  ✅ Add unambiguous imports on the fly
  ✅ Optimize imports on the fly
```

---

## Paso 3: Instalar GitHub Copilot en IntelliJ

### Requisitos previos
- Cuenta de GitHub gratuita: [github.com](https://github.com)

### Instalación

1. Abrir IntelliJ IDEA
2. `File` → `Settings` → `Plugins`
3. Pestaña **Marketplace** → buscar: `GitHub Copilot`
4. Click en **Install** → esperar descarga
5. **Reiniciar** IntelliJ IDEA
6. Al reiniciar, aparece el ícono de Copilot en la barra inferior
7. Click en el ícono → **Sign in to GitHub**
8. Se abre el navegador → Autorizar la aplicación
9. De vuelta en IntelliJ → verificar que dice **"Copilot: Ready"**

### Atajos útiles

| Atajo | Acción |
|-------|--------|
| `Tab` | Aceptar sugerencia de Copilot |
| `Esc` | Rechazar sugerencia |
| `Alt + ]` | Siguiente sugerencia |
| `Alt + [` | Sugerencia anterior |
| `Ctrl + Shift + C` | Abrir Copilot Chat |

### Verificar que funciona

1. Crear un archivo Java nuevo
2. Escribir: `// Crear una clase Persona con nombre y edad`
3. Presionar `Enter` → Copilot debería sugerir el código
4. Si no sugiere nada, verificar que el ícono diga "Ready"

---

## Paso 4: Instalar MariaDB Server

### Windows

1. Descargar MariaDB 10.6.x desde [mariadb.org/download](https://mariadb.org/download/)
2. Ejecutar instalador:
   - Definir **password de root** (¡anótalo!)
   - Puerto: **3306** (default)
   - Instalar como **servicio de Windows**
3. Verificar que el servicio está corriendo:
   - Abrir `services.msc` → buscar "MariaDB"
4. Conectar desde terminal:

```cmd
mysql -u root -p
```

### macOS

```bash
brew install mariadb
brew services start mariadb
mysql -u root -p
```

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install mariadb-server
sudo systemctl start mariadb
sudo mysql_secure_installation
mysql -u root -p
```

### Crear la base de datos del módulo

```sql
-- Conectado a MariaDB:
CREATE DATABASE learnhub
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- Verificar
SHOW DATABASES;
USE learnhub;
```

---

## Paso 5: Instalar Git

### Windows

1. Descargar desde [git-scm.com](https://git-scm.com/)
2. Ejecutar instalador con opciones predeterminadas
3. Verificar:

```cmd
git --version
```

### macOS / Linux

```bash
# macOS
brew install git

# Ubuntu/Debian
sudo apt install git

# Verificar
git --version
```

### Configurar Git

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"

# Verificar
git config --list
```

---

## Paso 6: Crear Proyecto Maven de Prueba

1. Abrir IntelliJ IDEA
2. `File` → `New` → `Project`
3. Seleccionar **Maven Archetype**
4. Configurar:
   - **Name:** `learnhub`
   - **GroupId:** `mx.unam.dgtic`
   - **ArtifactId:** `learnhub`
   - **JDK:** 17
   - **Archetype:** `maven-archetype-quickstart`
5. Click en **Create**
6. Esperar a que Maven descargue dependencias
7. Ejecutar `App.java` para verificar:

```
Hello World!
```

### Agregar dependencias al pom.xml

Abre `pom.xml` y agrega dentro de `<dependencies>`:

```xml
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
```

### Crear persistence.xml

Crear el archivo `src/main/resources/META-INF/persistence.xml`:

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
            <property name="jakarta.persistence.jdbc.user" value="root"/>
            <property name="jakarta.persistence.jdbc.password" value="TU_PASSWORD"/>
            <property name="jakarta.persistence.jdbc.driver"
                      value="org.mariadb.jdbc.Driver"/>

            <!-- Hibernate -->
            <property name="hibernate.dialect"
                      value="org.hibernate.dialect.MariaDBDialect"/>
            <property name="hibernate.hbm2ddl.auto" value="update"/>
            <property name="hibernate.show_sql" value="true"/>
            <property name="hibernate.format_sql" value="true"/>
        </properties>
    </persistence-unit>
</persistence>
```

> ⚠️ **Cambia `TU_PASSWORD` por tu contraseña real de MariaDB.**

---

## Paso 7: Verificación Final del Entorno

Ejecuta cada comando y marca los que funcionen:

```
[ ] java -version           →  17.0.x
[ ] mvn -version            →  3.9.x
[ ] git --version           →  2.x
[ ] mysql -u root -p        →  Conexión exitosa
[ ] SHOW DATABASES;         →  learnhub aparece
[ ] IntelliJ IDEA           →  Abre correctamente
[ ] GitHub Copilot          →  Status: Ready
[ ] Proyecto Maven          →  Compila sin errores
[ ] persistence.xml         →  Archivo creado
```

### Estructura esperada del proyecto

```
learnhub/
├── pom.xml
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── mx/unam/dgtic/
│   │   │       └── App.java
│   │   └── resources/
│   │       └── META-INF/
│   │           └── persistence.xml
│   └── test/
│       └── java/
│           └── mx/unam/dgtic/
│               └── AppTest.java
```

---

## Solución de Problemas Comunes

### "java: command not found"
- Verificar que `JAVA_HOME` está configurado
- Verificar que `%JAVA_HOME%\bin` está en el `PATH`
- Reiniciar la terminal después de configurar

### "Access denied for user 'root'"
- Verificar contraseña de MariaDB
- Intentar: `mysql -u root` (sin -p) en caso de instalación sin password

### "Cannot resolve symbol 'jakarta.persistence'"
- Click derecho en `pom.xml` → Maven → Reload Project
- Verificar conexión a internet (Maven necesita descargar dependencias)

### Copilot no sugiere código
- Verificar que el ícono dice "Copilot: Ready" (barra inferior)
- Reiniciar IntelliJ
- Verificar que tu cuenta de GitHub está autenticada
- En Settings → Plugins → verificar que el plugin está habilitado

### IntelliJ no reconoce el JDK
- `File` → `Project Structure` → `SDKs` → `+` → agregar JDK 17
- `File` → `Project Structure` → `Project` → `SDK` → seleccionar 17

---

> **Módulo 3: Persistencia con Hibernate** | 20 horas (4 sesiones × 5 hrs)
> Diplomado Java Ed. 20 | DGTIC-UNAM | [hxadev.tech](http://hxadev.tech)