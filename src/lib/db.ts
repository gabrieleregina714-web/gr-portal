import { neon } from '@neondatabase/serverless';

function getSQL() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');
  return neon(url);
}

// ─── Ensure table exists ───
let tableReady = false;
async function ensureTable() {
  if (tableReady) return;
  const sql = getSQL();
  await sql`
    CREATE TABLE IF NOT EXISTS collections (
      collection TEXT NOT NULL,
      id TEXT NOT NULL,
      data JSONB NOT NULL,
      PRIMARY KEY (collection, id)
    )
  `;
  tableReady = true;
}

// ─── Read all items in a collection ───
export async function readCollection<T>(collection: string, fallback: T[] = []): Promise<T[]> {
  try {
    await ensureTable();
    const sql = getSQL();
    const rows = await sql`
      SELECT data FROM collections WHERE collection = ${collection} ORDER BY id
    `;
    if (rows.length === 0) return fallback;
    return rows.map((r: any) => r.data as T);
  } catch (e) {
    console.error(`readCollection(${collection}) error:`, e);
    return fallback;
  }
}

// ─── Write full collection (replace all) ───
export async function writeCollection<T extends Record<string, any>>(collection: string, data: T[]): Promise<void> {
  await ensureTable();
  const sql = getSQL();
  await sql`DELETE FROM collections WHERE collection = ${collection}`;
  for (const item of data) {
    const id = item.id || generateId();
    await sql`
      INSERT INTO collections (collection, id, data)
      VALUES (${collection}, ${id}, ${JSON.stringify(item)})
    `;
  }
}

// ─── Read single item ───
export async function readItem<T>(collection: string, id: string): Promise<T | null> {
  try {
    await ensureTable();
    const sql = getSQL();
    const rows = await sql`
      SELECT data FROM collections WHERE collection = ${collection} AND id = ${id}
    `;
    if (rows.length === 0) return null;
    return rows[0].data as T;
  } catch {
    return null;
  }
}

// ─── Add item ───
export async function addItem<T extends Record<string, any>>(collection: string, item: T): Promise<T> {
  await ensureTable();
  const sql = getSQL();
  const id = item.id || generateId();
  const fullItem = { ...item, id } as T;
  await sql`
    INSERT INTO collections (collection, id, data)
    VALUES (${collection}, ${id}, ${JSON.stringify(fullItem)})
    ON CONFLICT (collection, id) DO UPDATE SET data = ${JSON.stringify(fullItem)}
  `;
  return fullItem;
}

// ─── Update item ───
export async function updateItem<T extends Record<string, any>>(collection: string, id: string, updates: Partial<T>): Promise<T | null> {
  await ensureTable();
  const sql = getSQL();
  const rows = await sql`
    SELECT data FROM collections WHERE collection = ${collection} AND id = ${id}
  `;
  if (rows.length === 0) return null;
  const current = rows[0].data as Record<string, any>;
  const updated = { ...current, ...updates } as T;
  await sql`
    UPDATE collections SET data = ${JSON.stringify(updated)}
    WHERE collection = ${collection} AND id = ${id}
  `;
  return updated;
}

// ─── Delete item ───
export async function deleteItem(collection: string, id: string): Promise<boolean> {
  await ensureTable();
  const sql = getSQL();
  await sql`
    DELETE FROM collections WHERE collection = ${collection} AND id = ${id}
  `;
  return true;
}

// ─── Generate unique ID ───
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}
