# 🤖 Guía de GitHub Copilot para Hibernate

> **Diplomado Desarrollo de Sistemas con Tecnología Java — Edición 20**
> Módulo 3: Persistencia con Hibernate
> DGTIC-UNAM | Instructor: Alfonso Hernández Xochipa | [hxadev.tech](http://hxadev.tech)

---

## ¿Qué es GitHub Copilot?

GitHub Copilot es un asistente de código con IA que se integra directamente en IntelliJ IDEA. En este módulo lo usamos como **herramienta de aprendizaje**, no como generador de respuestas.

### Filosofía

> **La IA explica → tú entiendes → tú escribes.**

---

## Instalación

1. Tener cuenta en [github.com](https://github.com) (gratuita)
2. IntelliJ → `File` → `Settings` → `Plugins`
3. Marketplace → buscar **"GitHub Copilot"** → Install
4. Reiniciar IntelliJ
5. Click en ícono de Copilot (barra inferior) → **Sign in to GitHub**
6. Autorizar en el navegador
7. Verificar: ícono dice **"Copilot: Ready"**

---

## Plan Free

| Característica | Incluido |
|----------------|----------|
| Autocompletado de código | 2,000 sugerencias/mes |
| Copilot Chat | Incluido |
| Soporte para Java | Sí |
| Funciona en IntelliJ | Sí |

---

## Atajos en IntelliJ

| Atajo | Acción |
|-------|--------|
| `Tab` | Aceptar sugerencia |
| `Esc` | Rechazar sugerencia |
| `Alt + ]` | Siguiente sugerencia alternativa |
| `Alt + [` | Sugerencia anterior |
| `Ctrl + Shift + C` | Abrir/cerrar Copilot Chat |

---

## Casos de Uso por Sesión

### Sesión 1: Entidades y CRUD

**Generar una entidad:**
```
Escribe en un archivo .java:

// Entidad JPA para tabla de categorías con id, name, description y active

→ Copilot sugerirá la clase con @Entity, @Id, @Column, etc.
→ Revisa cada anotación — ¿entiendes qué hace?
```

**Entender una anotación:**
```
Selecciona @GeneratedValue(strategy = GenerationType.IDENTITY)
→ Copilot Chat → "Explain this annotation"
→ Te explicará las diferencias entre IDENTITY, SEQUENCE, TABLE, AUTO
```

**Generar CRUD:**
```
Escribe:
// Método para guardar un curso en la base de datos usando EntityManager

→ Copilot sugiere el método con transaction management
→ Verifica: ¿usa begin(), persist() y commit()?
```

---

### Sesión 2: Relaciones

**Explorar relaciones:**
```
Copilot Chat:
"¿Cuál es la diferencia entre @OneToMany y @ManyToOne en JPA?"

→ Te explicará cuál va en el padre y cuál en el hijo
```

**Configurar cascade:**
```
Copilot Chat:
"¿Qué opciones tiene CascadeType y cuándo debo usar cada una?"

→ Te dará tabla comparativa de PERSIST, MERGE, REMOVE, ALL
```

**Entender orphanRemoval:**
```
Copilot Chat:
"¿Qué hace orphanRemoval = true en @OneToMany?"

→ Explicará el comportamiento y dará ejemplo
```

**Debug de relación:**
```
Si tienes un error como:
"Cannot add or update a child row: a foreign key constraint fails"

→ Selecciona el error → Copilot Chat → "What causes this error?"
```

---

### Sesión 3: HQL y Consultas

**Generar query HQL:**
```
Escribe en tu DAO:
// Buscar cursos por categoría y ordenar por precio descendente

→ Copilot sugerirá:
em.createQuery("SELECT c FROM Course c WHERE c.category.name = :catName ORDER BY c.price DESC", Course.class)
```

**Consulta con agregación:**
```
Escribe:
// Top 5 cursos con más inscripciones

→ Copilot sugerirá con COUNT, GROUP BY y setMaxResults
```

**Comparar SQL vs HQL:**
```
Copilot Chat:
"Convierte este SQL a HQL:
SELECT c.title, COUNT(e.id) FROM courses c
JOIN enrollments e ON c.id = e.id_course
GROUP BY c.title"

→ Te mostrará la versión HQL con objetos
```

---

### Sesión 4: Validaciones y DAO

**Agregar validaciones:**
```
Escribe arriba de un campo:
// Validar que el email no sea nulo, no esté vacío y tenga formato válido

→ Copilot sugerirá: @NotBlank @Email
```

**Generar DAO completo:**
```
Escribe:
public class CourseDAO {
    // CRUD completo para Course usando EntityManager

→ Copilot generará save, findById, findAll, update, delete
→ Revisa cada método — ¿maneja transacciones correctamente?
```

**Entender errores de validación:**
```
Si obtienes: ConstraintViolationException

→ Copilot Chat → "How do I handle ConstraintViolationException in Hibernate?"
```

---

## Prompts Útiles para Copilot Chat

### Explicaciones
```
"¿Qué es el problema del desajuste objeto-relacional (impedance mismatch)?"
"Explica el ciclo de vida de una entidad en JPA"
"¿Cuál es la diferencia entre JPA y Hibernate?"
"¿Por qué FetchType.LAZY es mejor que EAGER?"
"¿Qué es el problema N+1 queries?"
```

### Debugging
```
"Tengo LazyInitializationException, ¿cómo lo resuelvo?"
"¿Por qué me da 'detached entity passed to persist'?"
"Mi tabla no se crea aunque tengo @Entity, ¿qué puede estar mal?"
"¿Por qué mi @OneToMany no carga los hijos?"
```

### Buenas prácticas
```
"¿Cuándo debo usar CascadeType.ALL vs ser específico?"
"¿Es buena práctica usar @ManyToMany directo o entidad intermedia?"
"¿Cómo evito el problema N+1 en Hibernate?"
"¿Qué propiedades de hibernate.hbm2ddl.auto debo usar en producción?"
```

### Generación de datos
```
"Genera 10 INSERT SQL para una tabla de estudiantes con nombres mexicanos,
emails, fechas de nacimiento entre 1996-2002, y ciudades de México"
```

---

## Reglas del Módulo

### ✅ Permitido

- Usar Copilot para **entender** conceptos
- Pedir **explicaciones** de errores
- **Explorar** opciones de configuración
- Generar **datos de prueba**
- Documentar código con **Javadoc asistido**
- Usar Copilot Chat como **tutor personal**

### ❌ No permitido

- Copiar/pegar código sin entenderlo
- Pedir que **resuelva ejercicios completos**
- Entregar código que **no puedes explicar**
- Usar como sustituto de **leer la documentación**

### Verificación

El instructor puede preguntar en cualquier momento:
- *"¿Por qué usaste esta anotación?"*
- *"¿Qué SQL genera esta consulta HQL?"*
- *"¿Qué pasa si cambio LAZY a EAGER aquí?"*

Si no puedes responder, se ajusta la evaluación.

---

## Tips Avanzados

### Inline suggestions más precisas
```
Escribe un comentario descriptivo ANTES del código:

// Método que busca todos los cursos activos de una categoría
// usando HQL con parámetro nombrado y retorna List<Course>
public List<Course> findActiveByCategoryName(String categoryName) {

→ Copilot tendrá mejor contexto y sugerirá código más preciso
```

### Usar Copilot para documentar
```
Escribe /** arriba de un método:

/**
→ Copilot genera el Javadoc completo con @param, @return, @throws
```

### Aprender de las sugerencias
```
Cuando Copilot sugiera algo que no entiendas:
1. Acepta la sugerencia (Tab)
2. Selecciona el código
3. Copilot Chat → "Explain this code line by line"
4. Lee la explicación
5. Si no lo entiendes, borra y escríbelo tú mismo
```

---

> **Módulo 3: Persistencia con Hibernate** | Diplomado Java Ed. 20 | DGTIC-UNAM | [hxadev.tech](http://hxadev.tech)