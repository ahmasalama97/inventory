// app/db/db.ts
import * as SQLite from 'expo-sqlite';

let db: any = null;

export const initDB = async (): Promise<void> => {
  // open the database when initDB is called (avoid top-level await)
  db = await SQLite.openDatabaseAsync('inventory.db');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      category_id INTEGER,
      price REAL NOT NULL DEFAULT 0,
      quantity INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT
    );
    CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY NOT NULL,
      invoice_no TEXT NOT NULL,
      customer_id INTEGER,
      date TEXT,
      subtotal REAL,
      vat REAL,
      total REAL,
      paid REAL,
      due REAL,
      FOREIGN KEY (customer_id) REFERENCES customers(id)
    );
    CREATE TABLE IF NOT EXISTS invoice_items (
      id INTEGER PRIMARY KEY NOT NULL,
      invoice_id INTEGER,
      item_id INTEGER,
      qty INTEGER,
      price REAL,
      amount REAL,
      FOREIGN KEY (invoice_id) REFERENCES invoices(id),
      FOREIGN KEY (item_id) REFERENCES items(id)
    );
  `);
};

// generic helper
export const runQuery = async <T = any>(
  sql: string,
  params: any[] = []
): Promise<T[]> => {
  if (!db) {
    throw new Error('Database not initialized. Call initDB() before running queries.');
  }

  const result = await db.getAllAsync(sql, params) as T[];
  return result;
};

export const getDB = () => db;

export default getDB;
