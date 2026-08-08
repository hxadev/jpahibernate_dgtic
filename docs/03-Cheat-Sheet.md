# 📝 Cheat Sheet — Hibernate y JPA

> **Diplomado Desarrollo de Sistemas con Tecnología Java — Edición 20**
> Módulo 3: Persistencia con Hibernate
> DGTIC-UNAM | Instructor: Alfonso Hernández Xochipa | [hxadev.tech](http://hxadev.tech)

---

## 1. Anotaciones de Entidad

| Anotación | Descripción | Ejemplo |
|-----------|-------------|---------|
| `@Entity` | Marca clase como entidad JPA | `@Entity public class Course {}` |
| `@Table(name="...")` | Nombre de tabla en BD | `@Table(name="courses")` |
| `@Id` | Campo clave primaria | `@Id private int id;` |
| `@GeneratedValue` | Auto-generación de PK | `@GeneratedValue(strategy = GenerationType.IDENTITY)` |
| `@Column` | Configuración de columna | `@Column(name="title", nullable=false, length=200)` |
| `@Transient` | Campo NO persistido | `@Transient private String tempData;` |
| `@Temporal` | Tipo temporal | `@Temporal(TemporalType.DATE)` |
| `@Enumerated` | Persistir enum | `@Enumerated(EnumType.STRING)` |
| `@Lob` | Campo grande (CLOB/BLOB) | `@Lob private String content;` |
| `@CreationTimestamp` | Fecha de creación auto | Hibernate específico |
| `@UpdateTimestamp` | Fecha de update auto | Hibernate específico |

### Ejemplo de Entidad Completa

```java
@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_course")
    private Integer id;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "price", precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "duration")
    private Integer duration;

    @Column(name = "active")
    private Boolean active = true;

    @Enumerated(EnumType.STRING)
    @Column(name = "level")
    private CourseLevel level;

    // Constructores, getters, setters...
}
```

---

## 2. Estrategias de GeneratedValue

| Estrategia | Descripción | Cuándo usarla |
|------------|-------------|---------------|
| `IDENTITY` | Auto-increment de la BD | MariaDB/MySQL ✅ |
| `SEQUENCE` | Secuencia de BD | PostgreSQL, Oracle |
| `TABLE` | Tabla de secuencias | Portabilidad |
| `UUID` | Identificador único universal | IDs tipo String |
| `AUTO` | Hibernate decide | Evitar — poco predecible |

---

## 3. Relaciones

| Anotación | Relación | Lado | Ejemplo |
|-----------|----------|------|---------|
| `@ManyToOne` | N:1 | FK (hijo) | `Curso → Categoría` |
| `@OneToMany` | 1:N | Inverso (padre) | `Categoría → Cursos` |
| `@OneToOne` | 1:1 | Cualquiera | `User → Profile` |
| `@ManyToMany` | N:M | Cualquiera | `Student ↔ Course` |

### @ManyToOne + @OneToMany (1:N)

```java
// En Course (lado hijo — tiene la FK)
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "id_category", nullable = false)
private Category category;

// En Category (lado padre — inverso)
@OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
private List<Course> courses = new ArrayList<>();
```

### @OneToMany con orphanRemoval (1:N fuerte)

```java
// En Course
@OneToMany(mappedBy = "course",
           cascade = CascadeType.ALL,
           orphanRemoval = true)
private List<Module> modules = new ArrayList<>();
```

> Si quitas un Module de la lista → se elimina de la BD automáticamente.

### N:M con Entidad Intermedia (Enrollment)

```java
// En Student
@OneToMany(mappedBy = "student")
private List<Enrollment> enrollments = new ArrayList<>();

// En Course
@OneToMany(mappedBy = "course")
private List<Enrollment> enrollments = new ArrayList<>();

// Enrollment (entidad intermedia)
@Entity
@Table(name = "enrollments")
public class Enrollment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_student")
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_course")
    private Course course;

    private BigDecimal grade;

    @Enumerated(EnumType.STRING)
    private EnrollmentStatus status;

    private LocalDateTime enrollmentDate;
}
```

### N:M con @ManyToMany + @JoinTable

```java
// En Course
@ManyToMany
@JoinTable(
    name = "instructors_courses",
    joinColumns = @JoinColumn(name = "id_course"),
    inverseJoinColumns = @JoinColumn(name = "id_instructor")
)
private List<Instructor> instructors = new ArrayList<>();

// En Instructor
@ManyToMany(mappedBy = "instructors")
private List<Course> courses = new ArrayList<>();
```

---

## 4. Fetch y Cascade

### FetchType

| Tipo | Comportamiento | Default en |
|------|---------------|------------|
| `LAZY` | Carga bajo demanda | `@OneToMany`, `@ManyToMany` |
| `EAGER` | Carga inmediata | `@ManyToOne`, `@OneToOne` |

> **Regla:** Usa `LAZY` siempre. Solo cambia a `EAGER` cuando estés seguro de que lo necesitas.

### CascadeType

| Tipo | Efecto | Ejemplo |
|------|--------|---------|
| `PERSIST` | Guardar padre → guarda hijos | Crear curso con módulos |
| `MERGE` | Actualizar padre → actualiza hijos | Editar curso |
| `REMOVE` | Eliminar padre → elimina hijos | Borrar curso y sus módulos |
| `REFRESH` | Refrescar padre → refresca hijos | Recargar de BD |
| `DETACH` | Desconectar padre → desconecta hijos | |
| `ALL` | Todos los anteriores | Usar con cuidado |

---

## 5. Ciclo de Vida

```
         new()              persist()             close()
          │                    │                     │
          ▼                    ▼                     ▼
    ┌──────────┐        ┌──────────────┐      ┌──────────────┐
    │TRANSIENT │───────▶│ PERSISTENT   │─────▶│  DETACHED    │
    └──────────┘        └──────────────┘      └──────────────┘
                              │  ▲                    │
                        remove│  │merge()             │merge()
                              ▼  │                    │
                        ┌──────────────┐              │
                        │   REMOVED    │              │
                        └──────────────┘              ▼
                                                ┌──────────────┐
                                                │ PERSISTENT   │
                                                └──────────────┘
```

| Operación | De → A | Significado |
|-----------|--------|-------------|
| `new Course()` | → TRANSIENT | No está asociada a la sesión |
| `em.persist(course)` | → PERSISTENT | Administrada por Hibernate |
| `em.close()` | → DETACHED | Desconectada de la sesión |
| `em.merge(course)` | → PERSISTENT | Re-asociada a nueva sesión |
| `em.remove(course)` | → REMOVED | Marcada para eliminación |

---

## 6. CRUD con EntityManager

```java
EntityManagerFactory emf = Persistence.createEntityManagerFactory("learnhubPU");
EntityManager em = emf.createEntityManager();

// ── CREATE ──
em.getTransaction().begin();
Course course = new Course();
course.setTitle("Java desde Cero");
course.setPrice(new BigDecimal("2999.00"));
em.persist(course);
em.getTransaction().commit();

// ── READ ──
Course found = em.find(Course.class, 1);

// ── UPDATE ──
em.getTransaction().begin();
found.setPrice(new BigDecimal("3499.00"));
em.merge(found);
em.getTransaction().commit();

// ── DELETE ──
em.getTransaction().begin();
Course toDelete = em.find(Course.class, 1);
em.remove(toDelete);
em.getTransaction().commit();

em.close();
emf.close();
```

---

## 7. HQL — Hibernate Query Language

### Consultas básicas

```java
// Todos los cursos activos
List<Course> courses = em.createQuery(
    "SELECT c FROM Course c WHERE c.active = true ORDER BY c.title",
    Course.class
).getResultList();

// Con parámetro nombrado
List<Course> courses = em.createQuery(
    "SELECT c FROM Course c WHERE c.price BETWEEN :min AND :max",
    Course.class
)
.setParameter("min", new BigDecimal("1000"))
.setParameter("max", new BigDecimal("5000"))
.getResultList();
```

### JOINs

```java
// Cursos con su categoría (JOIN implícito)
"SELECT c FROM Course c WHERE c.category.name = :catName"

// JOIN explícito con Instructor
"SELECT c FROM Course c JOIN c.instructors i WHERE i.lastName = :name"

// Estudiantes inscritos en un curso
"SELECT s.firstName, s.lastName, e.grade, e.status " +
"FROM Enrollment e JOIN e.student s WHERE e.course.id = :courseId"
```

### Agregaciones

```java
// Contar inscripciones por curso
"SELECT c.title, COUNT(e) FROM Enrollment e JOIN e.course c " +
"GROUP BY c.title ORDER BY COUNT(e) DESC"

// Promedio de calificación
"SELECT c.title, AVG(e.grade) FROM Enrollment e JOIN e.course c " +
"WHERE e.status = 'COMPLETED' GROUP BY c.title HAVING AVG(e.grade) > :min"

// Ingresos por instructor
"SELECT i.firstName, SUM(c.price) FROM Enrollment e " +
"JOIN e.course c JOIN c.instructors i GROUP BY i.id"
```

### UPDATE y DELETE masivos

```java
// Actualizar precio
em.createQuery("UPDATE Course c SET c.price = c.price * 1.10 WHERE c.category.id = :catId")
  .setParameter("catId", 1)
  .executeUpdate();

// Eliminar inscripciones abandonadas
em.createQuery("DELETE FROM Enrollment e WHERE e.status = 'DROPPED'")
  .executeUpdate();
```

### Paginación

```java
List<Course> page = em.createQuery("SELECT c FROM Course c ORDER BY c.title", Course.class)
    .setFirstResult(0)   // offset
    .setMaxResults(10)    // limit
    .getResultList();
```

### @NamedQuery

```java
@Entity
@NamedQuery(name = "Course.findByCategory",
            query = "SELECT c FROM Course c WHERE c.category.name = :catName")
public class Course { ... }

// Uso:
List<Course> courses = em.createNamedQuery("Course.findByCategory", Course.class)
    .setParameter("catName", "Programación")
    .getResultList();
```

---

## 8. Bean Validation

| Anotación | Descripción | Ejemplo |
|-----------|-------------|---------|
| `@NotNull` | No acepta null | `@NotNull private String title;` |
| `@NotBlank` | No null, no vacío, no solo espacios | `@NotBlank private String title;` |
| `@NotEmpty` | No null, no vacío | `@NotEmpty private List items;` |
| `@Size(min, max)` | Longitud de String o colección | `@Size(min=2, max=200)` |
| `@Min(value)` | Valor numérico mínimo | `@Min(0) private int duration;` |
| `@Max(value)` | Valor numérico máximo | `@Max(10) private BigDecimal grade;` |
| `@Positive` | Mayor que 0 | `@Positive private BigDecimal price;` |
| `@PositiveOrZero` | Mayor o igual a 0 | `@PositiveOrZero private int stock;` |
| `@Email` | Formato de email | `@Email private String email;` |
| `@Past` | Fecha en el pasado | `@Past private LocalDate birthDate;` |
| `@Future` | Fecha en el futuro | `@Future private LocalDate deadline;` |
| `@Pattern(regexp)` | Patrón regex | `@Pattern(regexp="^[A-Z]{3}$")` |

### Ejemplo en entidad

```java
@Entity
public class Student {
    @Id
    private String id;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 2, max = 100, message = "Nombre entre 2 y 100 caracteres")
    private String firstName;

    @NotBlank
    private String lastName;

    @Email(message = "Email no válido")
    @Column(unique = true)
    private String email;

    @Past(message = "La fecha debe ser en el pasado")
    private LocalDate birthDate;

    @Pattern(regexp = "^[A-Z]{3}$", message = "País: 3 letras mayúsculas")
    private String country;
}
```

### Validar manualmente

```java
ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
Validator validator = factory.getValidator();

Student student = new Student();
student.setEmail("no-es-email");

Set<ConstraintViolation<Student>> violations = validator.validate(student);
for (ConstraintViolation<Student> v : violations) {
    System.out.println(v.getPropertyPath() + ": " + v.getMessage());
}
```

---

## 9. persistence.xml

```xml
<persistence-unit name="learnhubPU" transaction-type="RESOURCE_LOCAL">
    <properties>
        <!-- Conexión -->
        <property name="jakarta.persistence.jdbc.url"
                  value="jdbc:mariadb://localhost:3306/learnhub"/>
        <property name="jakarta.persistence.jdbc.user" value="root"/>
        <property name="jakarta.persistence.jdbc.password" value="password"/>
        <property name="jakarta.persistence.jdbc.driver"
                  value="org.mariadb.jdbc.Driver"/>

        <!-- Hibernate -->
        <property name="hibernate.dialect" value="org.hibernate.dialect.MariaDBDialect"/>
        <property name="hibernate.hbm2ddl.auto" value="update"/>
        <property name="hibernate.show_sql" value="true"/>
        <property name="hibernate.format_sql" value="true"/>
    </properties>
</persistence-unit>
```

### hibernate.hbm2ddl.auto

| Valor | Comportamiento | Cuándo usarlo |
|-------|---------------|---------------|
| `create` | Borra y recrea tablas | Desarrollo inicial |
| `create-drop` | Crea al iniciar, borra al cerrar | Pruebas |
| `update` | Actualiza esquema sin borrar datos | Desarrollo |
| `validate` | Solo valida, no modifica | Staging/Producción |
| `none` | No hace nada | Producción |

---

## 10. Patrón DAO

```java
public class CourseDAO {
    private EntityManagerFactory emf;

    public CourseDAO(EntityManagerFactory emf) {
        this.emf = emf;
    }

    public void save(Course course) {
        EntityManager em = emf.createEntityManager();
        em.getTransaction().begin();
        em.persist(course);
        em.getTransaction().commit();
        em.close();
    }

    public Course findById(int id) {
        EntityManager em = emf.createEntityManager();
        Course course = em.find(Course.class, id);
        em.close();
        return course;
    }

    public List<Course> findAll() {
        EntityManager em = emf.createEntityManager();
        List<Course> courses = em.createQuery(
            "SELECT c FROM Course c ORDER BY c.title", Course.class
        ).getResultList();
        em.close();
        return courses;
    }

    public List<Course> findByCategory(String categoryName) {
        EntityManager em = emf.createEntityManager();
        List<Course> courses = em.createQuery(
            "SELECT c FROM Course c WHERE c.category.name = :name", Course.class
        ).setParameter("name", categoryName).getResultList();
        em.close();
        return courses;
    }

    public void update(Course course) {
        EntityManager em = emf.createEntityManager();
        em.getTransaction().begin();
        em.merge(course);
        em.getTransaction().commit();
        em.close();
    }

    public void delete(int id) {
        EntityManager em = emf.createEntityManager();
        em.getTransaction().begin();
        Course course = em.find(Course.class, id);
        if (course != null) em.remove(course);
        em.getTransaction().commit();
        em.close();
    }
}
```

---

## 11. Tips de GitHub Copilot para Hibernate

| Acción | Cómo hacerlo |
|--------|-------------|
| Generar entidad | Escribe `@Entity` + nombre de clase → Copilot sugiere campos |
| Entender anotación | Selecciona `@ManyToOne` → Copilot Chat → *"Explain this"* |
| Generar HQL | Escribe `// Buscar cursos por categoría` → Copilot sugiere query |
| Debug error | Copia el error → Copilot Chat → *"What causes this?"* |
| Generar DAO | Escribe `public class CourseDAO` → Copilot sugiere métodos CRUD |
| Javadoc | Escribe `/**` arriba del método → Copilot genera documentación |
| Generar datos | *"Generate 10 INSERT statements for courses table"* |

---

## 12. Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `LazyInitializationException` | Acceder a relación LAZY fuera de sesión | Abrir sesión, usar JOIN FETCH, o cambiar a EAGER |
| `TransientObjectException` | Persistir entidad con referencia transient | Usar `cascade = PERSIST` o persistir la referencia primero |
| `detached entity passed to persist` | Persistir entidad ya guardada | Usar `merge()` en vez de `persist()` |
| `Table doesn't exist` | hbm2ddl.auto no genera tablas | Cambiar a `update` o `create` |
| `No Persistence provider` | persistence.xml mal ubicado | Debe estar en `src/main/resources/META-INF/` |
| `Unknown entity` | Entidad no registrada | Verificar `@Entity` y que el paquete sea escaneado |

---

> **Módulo 3: Persistencia con Hibernate** | 20 horas (4 sesiones × 5 hrs)
> Diplomado Java Ed. 20 | DGTIC-UNAM | [hxadev.tech](http://hxadev.tech)