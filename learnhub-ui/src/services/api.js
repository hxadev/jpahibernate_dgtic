// ============================================================
// Capa base de la API — LearnHub UI
// ------------------------------------------------------------
// Mientras USE_MOCKS sea true, todos los servicios responden
// con los datos de src/mocks (simulando latencia de red).
// En la Sesión 4 del módulo, cambia USE_MOCKS a false para
// consumir el API REST de tu backend Spring Boot + Hibernate.
// ============================================================
import { db } from '../mocks';

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
export const USE_MOCKS = true; // Cambiar a false cuando el backend esté listo

// Latencia simulada para que la UI muestre estados de carga realistas
const MOCK_DELAY_MS = 300;
export const delay = (ms = MOCK_DELAY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

const clone = (data) => JSON.parse(JSON.stringify(data));

// ---------- Cliente HTTP (modo backend real) ----------
async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

export const http = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
};

// ---------- Helpers CRUD sobre los mocks ----------
// collection: nombre del almacén en db (p. ej. 'courses')
// idField siempre es 'id'; los IDs numéricos se autoincrementan y los
// IDs con prefijo (INS-, STU-, MOD-) generan el siguiente consecutivo.

function nextId(collection, prefix) {
  const items = db[collection];
  if (!prefix) {
    return items.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
  }
  const max = items.reduce((acc, item) => {
    const n = parseInt(String(item.id).replace(`${prefix}-`, ''), 10);
    return Number.isNaN(n) ? acc : Math.max(acc, n);
  }, 0);
  return `${prefix}-${String(max + 1).padStart(3, '0')}`;
}

export const mockCrud = {
  async getAll(collection) {
    await delay();
    return clone(db[collection]);
  },

  async getById(collection, id) {
    await delay();
    const item = db[collection].find((it) => String(it.id) === String(id));
    if (!item) throw new Error(`No se encontró el registro ${id} en ${collection}`);
    return clone(item);
  },

  async create(collection, data, { idPrefix = null, timestamps = false } = {}) {
    await delay();
    const now = new Date().toISOString().slice(0, 19);
    const item = {
      ...data,
      id: nextId(collection, idPrefix),
      ...(timestamps ? { createdAt: now, updatedAt: now } : {}),
    };
    db[collection].push(item);
    return clone(item);
  },

  async update(collection, id, data, { timestamps = false } = {}) {
    await delay();
    const index = db[collection].findIndex((it) => String(it.id) === String(id));
    if (index === -1) throw new Error(`No se encontró el registro ${id} en ${collection}`);
    const now = new Date().toISOString().slice(0, 19);
    db[collection][index] = {
      ...db[collection][index],
      ...data,
      id: db[collection][index].id,
      ...(timestamps ? { updatedAt: now } : {}),
    };
    return clone(db[collection][index]);
  },

  async delete(collection, id) {
    await delay();
    const index = db[collection].findIndex((it) => String(it.id) === String(id));
    if (index === -1) throw new Error(`No se encontró el registro ${id} en ${collection}`);
    db[collection].splice(index, 1);
    return true;
  },
};

// Acceso de solo lectura a los almacenes mock (para queries derivadas)
export const mockDb = db;
