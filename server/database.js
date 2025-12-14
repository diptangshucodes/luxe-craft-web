import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../luxe-craft.db');
let db;

// Initialize SQLite database
const initDb = () => {
  return new Promise((resolve) => {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Database connection error:', err);
      } else {
        console.log('Connected to SQLite database at:', dbPath);
        db.run('PRAGMA foreign_keys = ON');
        resolve();
      }
    });
  });
};

// Initialize database tables
export const initializeDatabase = async () => {
  await initDb();

  db.serialize(() => {
    // Categories table
    db.run(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Products table
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        category TEXT NOT NULL,
        image_filename TEXT NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Email config table
    db.run(`
      CREATE TABLE IF NOT EXISTS email_config (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        email_user TEXT,
        email_password TEXT,
        email_host TEXT,
        email_port INTEGER DEFAULT 587,
        recipient_email TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Contact details table
    db.run(`
      CREATE TABLE IF NOT EXISTS contact_details (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        address TEXT,
        phone TEXT,
        email TEXT,
        facebook TEXT,
        instagram TEXT,
        twitter TEXT,
        linkedin TEXT,
        whatsapp TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if email config exists, if not create it
    db.get('SELECT * FROM email_config WHERE id = 1', (err, row) => {
      if (!row) {
        db.run(
          `INSERT INTO email_config (id, email_user, email_host, email_port, recipient_email)
           VALUES (1, ?, ?, ?, ?)`,
          [
            process.env.EMAIL_USER || '',
            process.env.EMAIL_HOST || 'smtp.gmail.com',
            process.env.EMAIL_PORT || 587,
            process.env.RECIPIENT_EMAIL || 'diptangshudo@gmail.com',
          ]
        );
      }
    });

    // Check if contact details exists, if not create it
    db.get('SELECT * FROM contact_details WHERE id = 1', (err, row) => {
      if (!row) {
        db.run(
          `INSERT INTO contact_details (id, address, phone, email, facebook, instagram, twitter, linkedin, whatsapp)
           VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            'Kamala Trader, New Delhi, India',
            '+91 9876543210',
            'info@kamaltrader.com',
            'https://facebook.com/kamaltrader',
            'https://instagram.com/kamaltrader',
            'https://twitter.com/kamaltrader',
            'https://linkedin.com/company/kamaltrader',
            'https://wa.me/919876543210',
          ]
        );
      }
    });

    // Add default categories if table is empty
    db.get('SELECT COUNT(*) as count FROM categories', (err, row) => {
      if (row && row.count === 0) {
        const defaultCategories = [
          'Bags & Briefcases',
          'Wallets & Cardholders',
          'Belts & Accessories',
          'Journals & Portfolios',
          'Custom Products'
        ];

        defaultCategories.forEach((category) => {
          db.run(
            'INSERT INTO categories (name) VALUES (?)',
            [category],
            (err) => {
              if (err && err.message.includes('UNIQUE constraint failed')) {
                // Category already exists, skip
              } else if (err) {
                console.error('Error inserting category:', err);
              }
            }
          );
        });
      }
    });

    // Add default products if table is empty
    db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
      if (row && row.count === 0) {
        const defaultProducts = [
          {
            name: 'Ladies Wallet Clutch',
            price: 2499,
            category: 'Wallets & Cardholders',
            image_filename: 'default-wallet-ladies.svg',
            description: 'Premium leather ladies wallet clutch with multiple card slots and coin pocket. Perfect for everyday use.'
          },
          {
            name: 'Leather Briefcase',
            price: 8999,
            category: 'Bags & Briefcases',
            image_filename: 'default-briefcase.svg',
            description: 'Professional leather briefcase with adjustable shoulder strap. Ideal for business travel and daily commute.'
          },
          {
            name: 'Leather Journal',
            price: 1599,
            category: 'Journals & Portfolios',
            image_filename: 'default-journal.svg',
            description: 'Hand-stitched leather journal with 200 premium pages. Perfect for notes, sketches, and journaling.'
          },
          {
            name: 'Leather Belt',
            price: 1299,
            category: 'Belts & Accessories',
            image_filename: 'default-belt.svg',
            description: 'Classic leather belt with adjustable sizing. Versatile design goes with any outfit.'
          },
          {
            name: 'Card Holder',
            price: 899,
            category: 'Wallets & Cardholders',
            image_filename: 'default-cardholder.svg',
            description: 'Compact leather card holder with RFID protection. Holds up to 12 cards in style.'
          }
        ];

        defaultProducts.forEach(product => {
          db.run(
            `INSERT INTO products (name, price, category, image_filename, description)
             VALUES (?, ?, ?, ?, ?)`,
            [product.name, product.price, product.category, product.image_filename, product.description]
          );
        });

        console.log('Default products inserted');
      }
    });
  });

  console.log('Database initialized at:', dbPath);
};

// Product operations
export const productDb = {
  create: (product) => {
    return new Promise((resolve, reject) => {
      const { name, price, category, image_filename, description } = product;
      db.run(
        `INSERT INTO products (name, price, category, image_filename, description)
         VALUES (?, ?, ?, ?, ?)`,
        [name, price, category, image_filename, description],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...product });
        }
      );
    });
  },

  getAll: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM products ORDER BY created_at DESC', (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  },

  getById: (id) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  update: (id, product) => {
    return new Promise((resolve, reject) => {
      const { name, price, category, description } = product;
      db.run(
        `UPDATE products 
         SET name = ?, price = ?, category = ?, description = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [name, price, category, description, id],
        async (err) => {
          if (err) reject(err);
          else {
            const updated = await productDb.getById(id);
            resolve(updated);
          }
        }
      );
    });
  },

  delete: (id) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM products WHERE id = ?', [id], (err, product) => {
        if (err) reject(err);
        else {
          db.run('DELETE FROM products WHERE id = ?', [id], (err) => {
            if (err) reject(err);
            else resolve(product);
          });
        }
      });
    });
  },

  getByCategory: (category) => {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM products WHERE category = ? ORDER BY created_at DESC',
        [category],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });
  },
};

// Email config operations
export const emailConfigDb = {
  get: () => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM email_config WHERE id = 1', (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  update: (config) => {
    return new Promise((resolve, reject) => {
      const { email_user, email_password, email_host, email_port, recipient_email } = config;
      db.run(
        `UPDATE email_config 
         SET email_user = ?, email_password = ?, email_host = ?, email_port = ?, recipient_email = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = 1`,
        [email_user, email_password, email_host, email_port, recipient_email],
        async (err) => {
          if (err) reject(err);
          else {
            const updated = await emailConfigDb.get();
            resolve(updated);
          }
        }
      );
    });
  },
};

// Contact details operations
export const contactDetailsDb = {
  get: () => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM contact_details WHERE id = 1', (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  update: (details) => {
    return new Promise((resolve, reject) => {
      const { address, phone, email, facebook, instagram, twitter, linkedin, whatsapp } = details;
      db.run(
        `UPDATE contact_details 
         SET address = ?, phone = ?, email = ?, facebook = ?, instagram = ?, twitter = ?, linkedin = ?, whatsapp = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = 1`,
        [address, phone, email, facebook, instagram, twitter, linkedin, whatsapp],
        async (err) => {
          if (err) reject(err);
          else {
            const updated = await contactDetailsDb.get();
            resolve(updated);
          }
        }
      );
    });
  },
};

// Category operations
export const categoryDb = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM categories ORDER BY name ASC', (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  },

  create: (name) => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO categories (name) VALUES (?)',
        [name],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, name });
        }
      );
    });
  },

  update: (id, name) => {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE categories SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [name, id],
        (err) => {
          if (err) reject(err);
          else resolve({ id, name });
        }
      );
    });
  },

  delete: (id) => {
    return new Promise((resolve, reject) => {
      db.run(
        'DELETE FROM categories WHERE id = ?',
        [id],
        (err) => {
          if (err) reject(err);
          else resolve({ success: true });
        }
      );
    });
  },
};

export default db;
