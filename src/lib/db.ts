import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Read environments
dotenv.config();

// Default in-memory collections (will be used as fallbacks)
const fallbackUsers: any[] = [
  { id: 'admin1', name: 'Admin User', email: 'admin@bloom.com', password: bcrypt.hashSync('admin123', 8), role: 'admin' },
  { id: 'user1', name: 'Jane Doe', email: 'jane@example.com', password: bcrypt.hashSync('user123', 8), role: 'user' }
];

const fallbackCategories: any[] = [
  { id: 'c1', name: 'Women', slug: 'women' },
  { id: 'c2', name: 'Men', slug: 'men' },
  { id: 'c3', name: 'Unisex', slug: 'unisex' },
  { id: 'c4', name: 'Floral', slug: 'floral' },
  { id: 'c5', name: 'Woody', slug: 'woody' },
  { id: 'c6', name: 'Fresh', slug: 'fresh' }
];

const fallbackProducts: any[] = [
  { 
    id: '1', 
    name: 'Rose Oud Lumineuse', 
    price: 145, 
    category: 'Women', 
    categories: ['Women', 'Floral'], 
    imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600', 
    description: 'An enchanting bouquet of Damask rose touched with smoky oud, warm amber, and a delicate hint of sweet vanilla. Pure liquid poetry, designed to linger elegantly.', 
    inStock: true,
    rating: 4.9,
    reviewsCount: 124,
    isTrending: true,
    isBestSeller: true,
    isNewArrival: false
  },
  { 
    id: '2', 
    name: 'Jardin de Jasmin', 
    price: 120, 
    category: 'Women', 
    categories: ['Women', 'Floral'], 
    imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600', 
    description: 'A delicate morning stroll through a blooming jasmin orchard. Expressing fresh notes of white petals, crystalline orange blossom, and a light cashmere musk base.', 
    inStock: true,
    rating: 4.8,
    reviewsCount: 98,
    isTrending: true,
    isBestSeller: false,
    isNewArrival: true
  },
  { 
    id: '3', 
    name: 'Santal Impérial', 
    price: 160, 
    category: 'Unisex', 
    categories: ['Unisex', 'Woody'], 
    imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=600', 
    description: 'A majestic harmony of Mysore sandalwood, dry cedarwood, cardamom, and soft powdery iris. Sophisticated, warm, and comforting for any gender.', 
    inStock: true,
    rating: 5.0,
    reviewsCount: 142,
    isTrending: true,
    isBestSeller: true,
    isNewArrival: false
  },
  { 
    id: '4', 
    name: 'Bleu Intense pour Homme', 
    price: 135, 
    category: 'Men', 
    categories: ['Men', 'Fresh'], 
    imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=600', 
    description: 'Fresh top notes of Sicilian grapefruit, cold mint, and pink pepper blended flawlessly with a magnetic vetiver and earthy patchouli dry-down.', 
    inStock: true,
    rating: 4.7,
    reviewsCount: 86,
    isTrending: false,
    isBestSeller: true,
    isNewArrival: false
  },
  { 
    id: '5', 
    name: 'Nectar de Pivoine', 
    price: 115, 
    category: 'Women', 
    categories: ['Women', 'Floral'], 
    imageUrl: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&q=80&w=600', 
    description: 'The voluptuous essence of fresh-cut blush peonies and crisp red apple, wrapped beautifully in a soft suede blanket and sweet royal white honey.', 
    inStock: true,
    rating: 4.9,
    reviewsCount: 74,
    isTrending: true,
    isBestSeller: false,
    isNewArrival: true
  },
  { 
    id: '6', 
    name: 'Neroli Sauvage', 
    price: 150, 
    category: 'Unisex', 
    categories: ['Unisex', 'Fresh'], 
    imageUrl: 'https://images.unsplash.com/photo-1588405748373-122b2321bc31?auto=format&fit=crop&q=80&w=600', 
    description: 'A wild, energizing gust of bright Italian neroli, zesty bitter orange, and crisp aquatic breeze cooled gently with sweet mineral ambergris.', 
    inStock: true,
    rating: 4.6,
    reviewsCount: 52,
    isTrending: false,
    isBestSeller: false,
    isNewArrival: true
  }
];

const fallbackOrders: any[] = [
  { id: 'ord1', userId: 'user1', items: [{ productId: '1', quantity: 1, price: 65, name: 'Rose Oud Lumineuse', imageUrl: '' }], total: 65, status: 'completed', createdAt: new Date().toISOString() }
];

const fallbackWishlist: any[] = [];
const fallbackCart: any[] = [];

// MySQL pool connection setup
let pool: mysql.Pool | null = null;
let useFallback = true;

const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const dbPort = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;

if (dbHost && dbUser && dbName) {
  try {
    pool = mysql.createPool({
      host: dbHost,
      user: dbUser,
      password: dbPassword,
      database: dbName,
      port: dbPort,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    useFallback = false;
    console.log(`[SQL Client] Initializing MySQL/MariaDB connection pool towards alwaysdata: ${dbHost}`);
  } catch (err) {
    console.error('[SQL Client] Error during MySQL pool establishment, falling back to safe local in-memory DB:', err);
    useFallback = true;
  }
} else {
  console.log('[SQL Client] DB credentials not fully configured in environment. Using robust local in-memory database fallback.');
  useFallback = true;
}

// Helper to run query safely
async function executeQuery<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  if (useFallback || !pool) {
    throw new Error('Database is running in offline fallback mode.');
  }
  const [rows] = await pool.execute(sql, params);
  return rows as T[];
}

// Bootstrap schema table setups & seedings with complete 3NF normalization
export async function bootstrapDB() {
  if (useFallback) {
    console.log('[Bootstrap] MySQL is not configured. Running database pre-seeding inside in-memory driver successfully.');
    return;
  }

  try {
    console.log('[Bootstrap] Checking alwaysdata database tables structure...');
    
    // 1. Create Users Table (3NF)
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        phone VARCHAR(50) DEFAULT '',
        address TEXT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 2. Create Categories Table (3NF)
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 3. Create Products Table (3NF aligned: read & write via product_categories junction schema, maintaining simple category string inside products table)
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        category VARCHAR(255) NULL,
        imageUrl TEXT NOT NULL,
        description TEXT NOT NULL,
        inStock TINYINT(1) DEFAULT 1,
        rating DECIMAL(3, 2) DEFAULT 4.5,
        reviewsCount INT DEFAULT 0,
        isTrending TINYINT(1) DEFAULT 0,
        isBestSeller TINYINT(1) DEFAULT 0,
        isNewArrival TINYINT(1) DEFAULT 0
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 4. Create Product-Categories Junction Table (3NF normalization to handle many-to-many cleanly without JSON listing representation)
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS product_categories (
        product_id VARCHAR(50) NOT NULL,
        category_id VARCHAR(50) NOT NULL,
        PRIMARY KEY (product_id, category_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 5. Create Orders Table (3NF aligned: metadata only - items are stored normalized in order_items details table)
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(50) PRIMARY KEY,
        userId VARCHAR(50) NOT NULL,
        items TEXT NULL,
        total DECIMAL(10, 2) NOT NULL,
        shippingAddress TEXT NOT NULL,
        city VARCHAR(255) NOT NULL,
        postalCode VARCHAR(50) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        createdAt VARCHAR(100) NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 6. Create Order line-items Details Table (3NF normalization to handle items array/atomic relations securely)
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS order_items (
        id VARCHAR(50) PRIMARY KEY,
        order_id VARCHAR(50) NOT NULL,
        product_id VARCHAR(50) NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 7. Create Wishlist Table (3NF)
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS wishlist (
        id VARCHAR(50) PRIMARY KEY,
        userId VARCHAR(50) NOT NULL,
        productId VARCHAR(50) NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 8. Create Cart Table (3NF)
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS cart (
        id VARCHAR(50) PRIMARY KEY,
        userId VARCHAR(50) NOT NULL,
        productId VARCHAR(50) NOT NULL,
        quantity INT NOT NULL,
        UNIQUE KEY user_product (userId, productId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Seed default categories if empty
    const cats = await executeQuery('SELECT COUNT(*) as count FROM categories');
    if ((cats[0] as any).count === 0) {
      console.log('[Bootstrap] Seeding default categories in alwaysdata MySQL...');
      for (const cat of fallbackCategories) {
        await executeQuery(
          'INSERT INTO categories (id, name, slug) VALUES (?, ?, ?)',
          [cat.id, cat.name, cat.slug]
        );
      }
    }

    // Seed default products if empty
    const prods = await executeQuery('SELECT COUNT(*) as count FROM products');
    if ((prods[0] as any).count === 0) {
      console.log('[Bootstrap] Seeding default products in alwaysdata MySQL...');
      for (const prod of fallbackProducts) {
        await executeQuery(
          `INSERT INTO products (id, name, price, category, imageUrl, description, inStock, rating, reviewsCount, isTrending, isBestSeller, isNewArrival) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            prod.id, 
            prod.name, 
            prod.price, 
            prod.category || (prod.categories && prod.categories[0]) || '',
            prod.imageUrl, 
            prod.description, 
            prod.inStock ? 1 : 0, 
            prod.rating, 
            prod.reviewsCount,
            prod.isTrending ? 1 : 0,
            prod.isBestSeller ? 1 : 0,
            prod.isNewArrival ? 1 : 0
          ]
        );

        // Map categories dynamically for seed data
        const allCats = await executeQuery('SELECT * FROM categories');
        const categoriesList = prod.categories || (prod.category ? [prod.category] : []);
        for (const catName of categoriesList) {
          if (!catName) continue;
          let matchedCat = allCats.find((c: any) => c.name.toLowerCase() === catName.toLowerCase());
          if (!matchedCat) {
            const newCatId = `cat${Date.now()}_${Math.floor(Math.random() * 1000)}`;
            const slug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            await executeQuery('INSERT INTO categories (id, name, slug) VALUES (?, ?, ?)', [newCatId, catName, slug]);
            matchedCat = { id: newCatId, name: catName };
            allCats.push(matchedCat);
          }
          await executeQuery('INSERT IGNORE INTO product_categories (product_id, category_id) VALUES (?, ?)', [prod.id, matchedCat.id]);
        }
      }
    }

    // Seed default admin and user account if users table is empty
    const usrs = await executeQuery('SELECT COUNT(*) as count FROM users');
    if ((usrs[0] as any).count === 0) {
      console.log('[Bootstrap] Seeding default user accounts in alwaysdata MySQL...');
      for (const usr of fallbackUsers) {
        await executeQuery(
          'INSERT INTO users (id, name, email, password, role, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [usr.id, usr.name, usr.email, usr.password, usr.role, '', '']
        );
      }
    }

    // Run 3NF product-categories migration and safe column setup/drop
    try {
      // 1. Ensure 'category' column exists
      const checkCat = await executeQuery(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
          AND TABLE_NAME = 'products' 
          AND COLUMN_NAME = 'category'
      `);
      if (checkCat.length === 0) {
        console.log('[Bootstrap Migration] Adding category column back to products table...');
        await executeQuery('ALTER TABLE products ADD COLUMN category VARCHAR(255) NULL');
        // Backfill the category values from product_categories junction table
        await executeQuery(`
          UPDATE products p
          SET p.category = (
            SELECT c.name 
            FROM product_categories pc
            JOIN categories c ON pc.category_id = c.id
            WHERE pc.product_id = p.id
            LIMIT 1
          )
        `);
        console.log('[Bootstrap Migration] Backfilled category column successfully.');
      }

      // 2. Safely drop 'categories' column if it exists
      const checkCats = await executeQuery(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
          AND TABLE_NAME = 'products' 
          AND COLUMN_NAME = 'categories'
      `);
      if (checkCats.length > 0) {
        await executeQuery('ALTER TABLE products DROP COLUMN categories');
        console.log('[Bootstrap Migration] Dropped redundant categories column from products table.');
      }
    } catch (e: any) {
      console.error('[Bootstrap Migration] Error during products category column migration:', e);
    }

    // Run 3NF orders-items migration in the background
    try {
      const oiCount = await executeQuery('SELECT COUNT(*) as count FROM order_items');
      if ((oiCount[0] as any).count === 0) {
        console.log('[Bootstrap Migration] Connecting existing orders to 3NF line-items table...');
        const existingOrders = await executeQuery('SELECT id, items FROM orders WHERE items IS NOT NULL AND items != ""');
        
        for (const order of existingOrders) {
          const orderId = order.id;
          let items: any[] = [];
          try {
            items = JSON.parse(order.items);
          } catch (e) {
            console.error('[Bootstrap Migration] Order items parsing error on order:', orderId, e);
          }
          
          for (const item of items) {
            const itemId = `oi${Date.now()}_${Math.floor(Math.random() * 10000)}`;
            await executeQuery(
              'INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES (?, ?, ?, ?, ?)',
              [
                itemId,
                orderId,
                item.productId || item.id,
                Number(item.quantity || 1),
                Number(item.price || 0)
              ]
            );
          }
        }
      }
    } catch (e) {
      console.error('[Bootstrap Migration] Error migrating order_items:', e);
    }

    console.log('[Bootstrap] Database 3NF structure and checkouts completed smoothly.');
  } catch (err) {
    console.error('[Bootstrap] Error during database tables bootstrap:', err);
    console.log('[Bootstrap] Gracefully continuing server startup with dynamic fallback.');
  }
}

// Centralized DB repository methods abstraction
export const db = {
  get isMySQL() {
    return !useFallback;
  },

  // USERS
  async getUsers(): Promise<any[]> {
    if (useFallback) return fallbackUsers;
    try {
      const rows = await executeQuery('SELECT * FROM users');
      return rows;
    } catch (err) {
      console.error('[DB Error] getUsers failed:', err);
      return fallbackUsers;
    }
  },

  async getUserById(id: string): Promise<any | null> {
    if (useFallback) {
      return fallbackUsers.find(u => u.id === id) || null;
    }
    try {
      const rows = await executeQuery('SELECT * FROM users WHERE id = ?', [id]);
      return rows.length > 0 ? rows[0] : null;
    } catch (err) {
      console.error('[DB Error] getUserById failed:', err);
      return fallbackUsers.find(u => u.id === id) || null;
    }
  },

  async getUserByEmail(email: string): Promise<any | null> {
    if (useFallback) {
      return fallbackUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
    }
    try {
      const rows = await executeQuery('SELECT * FROM users WHERE LOWER(email) = LOWER(?)', [email]);
      return rows.length > 0 ? rows[0] : null;
    } catch (err) {
      console.error('[DB Error] getUserByEmail failed:', err);
      return fallbackUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
    }
  },

  async createUser(user: any): Promise<any> {
    const id = user.id || `usr${Date.now()}`;
    const newUser = {
      id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role || 'user',
      phone: user.phone || '',
      address: user.address || ''
    };

    if (useFallback) {
      fallbackUsers.push(newUser);
      return newUser;
    }

    try {
      await executeQuery(
        'INSERT INTO users (id, name, email, password, role, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [newUser.id, newUser.name, newUser.email, newUser.password, newUser.role, newUser.phone, newUser.address]
      );
      return newUser;
    } catch (err) {
      console.error('[DB Error] createUser failed:', err);
      fallbackUsers.push(newUser);
      return newUser;
    }
  },

  async updateUser(id: string, updates: any): Promise<any | null> {
    if (useFallback) {
      const idx = fallbackUsers.findIndex(u => u.id === id);
      if (idx === -1) return null;
      fallbackUsers[idx] = { ...fallbackUsers[idx], ...updates };
      return fallbackUsers[idx];
    }

    try {
      const existing = await this.getUserById(id);
      if (!existing) return null;

      const merged = { ...existing, ...updates };
      await executeQuery(
        `UPDATE users SET name = ?, email = ?, password = ?, role = ?, phone = ?, address = ? WHERE id = ?`,
        [merged.name, merged.email, merged.password, merged.role, merged.phone || '', merged.address || '', id]
      );
      return merged;
    } catch (err) {
      console.error('[DB Error] updateUser failed:', err);
      const idx = fallbackUsers.findIndex(u => u.id === id);
      if (idx === -1) return null;
      fallbackUsers[idx] = { ...fallbackUsers[idx], ...updates };
      return fallbackUsers[idx];
    }
  },

  async deleteUser(id: string): Promise<boolean> {
    if (useFallback) {
      const idx = fallbackUsers.findIndex(u => u.id === id);
      if (idx === -1) return false;
      fallbackUsers.splice(idx, 1);
      return true;
    }

    try {
      await executeQuery('DELETE FROM users WHERE id = ?', [id]);
      return true;
    } catch (err) {
      console.error('[DB Error] deleteUser failed:', err);
      const idx = fallbackUsers.findIndex(u => u.id === id);
      if (idx === -1) return false;
      fallbackUsers.splice(idx, 1);
      return true;
    }
  },

  // PRODUCTS USING 3NF (Query junction table dynamically to return aligned results)
  async getProducts(): Promise<any[]> {
    if (useFallback) return fallbackProducts;
    try {
      const rows = await executeQuery('SELECT * FROM products');
      
      // Fetch category mapping from Junction table (many-to-many 3NF alignment)
      let mappings: any[] = [];
      try {
        mappings = await executeQuery(`
          SELECT pc.product_id, c.id as category_id, c.name as category_name 
          FROM product_categories pc 
          JOIN categories c ON pc.category_id = c.id
        `);
      } catch (e) {
        console.error('[DB Loader] product_categories query fell back:', e);
      }

      return rows.map((p: any) => {
        const prodMappings = mappings.filter((m: any) => m.product_id === p.id);
        const categories = prodMappings.map((m: any) => m.category_name);
        const mainCategory = p.category || categories[0] || '';
        
        return {
          ...p,
          inStock: Boolean(p.inStock),
          isTrending: Boolean(p.isTrending),
          isBestSeller: Boolean(p.isBestSeller),
          isNewArrival: Boolean(p.isNewArrival),
          category: mainCategory,
          categories: categories.length > 0 ? categories : (p.category ? [p.category] : [])
        };
      });
    } catch (err) {
      console.error('[DB Error] getProducts failed:', err);
      return fallbackProducts;
    }
  },

  async getProductById(id: string): Promise<any | null> {
    if (useFallback) {
      return fallbackProducts.find(p => p.id === id) || null;
    }
    try {
      const rows = await executeQuery('SELECT * FROM products WHERE id = ?', [id]);
      if (rows.length === 0) return null;
      const p = rows[0];

      let categories: string[] = [];
      try {
        const mappings = await executeQuery(`
          SELECT c.id as category_id, c.name as category_name 
          FROM product_categories pc 
          JOIN categories c ON pc.category_id = c.id
          WHERE pc.product_id = ?
        `, [id]);
        categories = mappings.map((m: any) => m.category_name);
      } catch (e) {
        console.error('[DB Loader] product_categories mapping loader fell back:', e);
      }

      const mainCategory = p.category || categories[0] || '';

      return {
        ...p,
        inStock: Boolean(p.inStock),
        isTrending: Boolean(p.isTrending),
        isBestSeller: Boolean(p.isBestSeller),
        isNewArrival: Boolean(p.isNewArrival),
        category: mainCategory,
        categories: categories.length > 0 ? categories : (p.category ? [p.category] : [])
      };
    } catch (err) {
      console.error('[DB Error] getProductById failed:', err);
      return fallbackProducts.find(p => p.id === id) || null;
    }
  },

  async createProduct(product: any): Promise<any> {
    const id = product.id || `p${Date.now()}`;
    const newProduct = {
      id,
      name: product.name,
      price: Number(product.price),
      imageUrl: product.imageUrl,
      description: product.description || '',
      inStock: product.inStock !== undefined ? Boolean(product.inStock) : true,
      rating: product.rating || 4.5,
      reviewsCount: product.reviewsCount || 0,
      isTrending: product.isTrending || false,
      isBestSeller: product.isBestSeller || false,
      isNewArrival: product.isNewArrival || false,
      category: product.category || (product.categories && product.categories[0]) || '',
      categories: product.categories || (product.category ? [product.category] : [])
    };

    if (useFallback) {
      fallbackProducts.push(newProduct);
      return newProduct;
    }

    try {
      // 1. Write metadata into products table (storing single category column)
      await executeQuery(
        `INSERT INTO products (id, name, price, category, imageUrl, description, inStock, rating, reviewsCount, isTrending, isBestSeller, isNewArrival) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newProduct.id,
          newProduct.name,
          newProduct.price,
          newProduct.category,
          newProduct.imageUrl,
          newProduct.description,
          newProduct.inStock ? 1 : 0,
          newProduct.rating,
          newProduct.reviewsCount,
          newProduct.isTrending ? 1 : 0,
          newProduct.isBestSeller ? 1 : 0,
          newProduct.isNewArrival ? 1 : 0
        ]
      );

      // 2. Insert into product_categories (3NF Junction Mapping)
      try {
        const allCats = await executeQuery('SELECT * FROM categories');
        for (const catName of newProduct.categories) {
          if (!catName) continue;
          let matchedCat = allCats.find((c: any) => c.name.toLowerCase() === catName.toLowerCase());
          if (!matchedCat) {
            const newCatId = `cat${Date.now()}_${Math.floor(Math.random() * 1000)}`;
            const slug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            await executeQuery('INSERT INTO categories (id, name, slug) VALUES (?, ?, ?)', [newCatId, catName, slug]);
            matchedCat = { id: newCatId, name: catName };
            allCats.push(matchedCat);
          }
          await executeQuery('INSERT IGNORE INTO product_categories (product_id, category_id) VALUES (?, ?)', [id, matchedCat.id]);
        }
      } catch (e) {
        console.error('[DB Mapper] Failed updating product_categories junction table:', e);
      }

      return newProduct;
    } catch (err) {
      console.error('[DB Error] createProduct failed:', err);
      fallbackProducts.push(newProduct);
      return newProduct;
    }
  },

  async updateProduct(id: string, updates: any): Promise<any | null> {
    if (useFallback) {
      const idx = fallbackProducts.findIndex(p => p.id === id);
      if (idx === -1) return null;
      fallbackProducts[idx] = { ...fallbackProducts[idx], ...updates };
      return fallbackProducts[idx];
    }

    try {
      const existing = await this.getProductById(id);
      if (!existing) return null;

      const merged = { ...existing, ...updates };
      
      // Update fields to keep in response
      merged.category = updates.category || (updates.categories && updates.categories[0]) || existing.category;
      merged.categories = updates.categories || (updates.category ? [updates.category] : existing.categories);

      // 1. Update products details table (updating single category column)
      await executeQuery(
        `UPDATE products SET name = ?, price = ?, category = ?, imageUrl = ?, description = ?, inStock = ?, rating = ?, reviewsCount = ?, isTrending = ?, isBestSeller = ?, isNewArrival = ? WHERE id = ?`,
        [
          merged.name,
          merged.price,
          merged.category,
          merged.imageUrl,
          merged.description,
          merged.inStock ? 1 : 0,
          merged.rating,
          merged.reviewsCount,
          merged.isTrending ? 1 : 0,
          merged.isBestSeller ? 1 : 0,
          merged.isNewArrival ? 1 : 0,
          id
        ]
      );

      // 2. Re-align junction product_categories (3NF Compliance)
      if (updates.categories || updates.category) {
        try {
          await executeQuery('DELETE FROM product_categories WHERE product_id = ?', [id]);
          const allCats = await executeQuery('SELECT * FROM categories');
          
          for (const catName of merged.categories) {
            if (!catName) continue;
            let matchedCat = allCats.find((c: any) => c.name.toLowerCase() === catName.toLowerCase());
            if (!matchedCat) {
              const newCatId = `cat${Date.now()}_${Math.floor(Math.random() * 1000)}`;
              const slug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              await executeQuery('INSERT INTO categories (id, name, slug) VALUES (?, ?, ?)', [newCatId, catName, slug]);
              matchedCat = { id: newCatId, name: catName };
              allCats.push(matchedCat);
            }
            await executeQuery('INSERT IGNORE INTO product_categories (product_id, category_id) VALUES (?, ?)', [id, matchedCat.id]);
          }
        } catch (e) {
          console.error('[DB Mapper] Failed reordering product_categories:', e);
        }
      }

      return merged;
    } catch (err) {
      console.error('[DB Error] updateProduct failed:', err);
      const idx = fallbackProducts.findIndex(p => p.id === id);
      if (idx === -1) return null;
      fallbackProducts[idx] = { ...fallbackProducts[idx], ...updates };
      return fallbackProducts[idx];
    }
  },

  async deleteProduct(id: string): Promise<boolean> {
    if (useFallback) {
      const idx = fallbackProducts.findIndex(p => p.id === id);
      if (idx === -1) return false;
      fallbackProducts.splice(idx, 1);
      return true;
    }

    try {
      try {
        await executeQuery('DELETE FROM product_categories WHERE product_id = ?', [id]);
      } catch (e) {}
      await executeQuery('DELETE FROM products WHERE id = ?', [id]);
      return true;
    } catch (err) {
      console.error('[DB Error] deleteProduct failed:', err);
      const idx = fallbackProducts.findIndex(p => p.id === id);
      if (idx === -1) return false;
      fallbackProducts.splice(idx, 1);
      return true;
    }
  },

  // CATEGORIES
  async getCategories(): Promise<any[]> {
    if (useFallback) return fallbackCategories;
    try {
      const rows = await executeQuery('SELECT * FROM categories');
      return rows;
    } catch (err) {
      console.error('[DB Error] getCategories failed:', err);
      return fallbackCategories;
    }
  },

  async createCategory(cat: any): Promise<any> {
    const id = cat.id || `cat${Date.now()}`;
    const newCat = {
      id,
      name: cat.name,
      slug: cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };

    if (useFallback) {
      fallbackCategories.push(newCat);
      return newCat;
    }

    try {
      await executeQuery(
        'INSERT INTO categories (id, name, slug) VALUES (?, ?, ?)',
        [newCat.id, newCat.name, newCat.slug]
      );
      return newCat;
    } catch (err) {
      console.error('[DB Error] createCategory failed:', err);
      fallbackCategories.push(newCat);
      return newCat;
    }
  },

  async updateCategory(id: string, updates: any): Promise<any | null> {
    if (useFallback) {
      const idx = fallbackCategories.findIndex(c => c.id === id);
      if (idx === -1) return null;
      fallbackCategories[idx] = { ...fallbackCategories[idx], ...updates };
      return fallbackCategories[idx];
    }

    try {
      const rows = await executeQuery('SELECT * FROM categories WHERE id = ?', [id]);
      if (rows.length === 0) return null;
      const merged = { ...rows[0], ...updates };
      if (updates.name && !updates.slug) {
        merged.slug = updates.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      }
      await executeQuery(
        'UPDATE categories SET name = ?, slug = ? WHERE id = ?',
        [merged.name, merged.slug, id]
      );
      return merged;
    } catch (err) {
      console.error('[DB Error] updateCategory failed:', err);
      const idx = fallbackCategories.findIndex(c => c.id === id);
      if (idx === -1) return null;
      fallbackCategories[idx] = { ...fallbackCategories[idx], ...updates };
      return fallbackCategories[idx];
    }
  },

  async deleteCategory(id: string): Promise<boolean> {
    if (useFallback) {
      const idx = fallbackCategories.findIndex(c => c.id === id);
      if (idx === -1) return false;
      fallbackCategories.splice(idx, 1);
      return true;
    }

    try {
      try {
        await executeQuery('DELETE FROM product_categories WHERE category_id = ?', [id]);
      } catch (e) {}
      await executeQuery('DELETE FROM categories WHERE id = ?', [id]);
      return true;
    } catch (err) {
      console.error('[DB Error] deleteCategory failed:', err);
      const idx = fallbackCategories.findIndex(c => c.id === id);
      if (idx === -1) return false;
      fallbackCategories.splice(idx, 1);
      return true;
    }
  },

  // ORDERS USING 3NF COMPLIANT ORDER-ITEMS JOIN
  async getOrders(): Promise<any[]> {
    if (useFallback) return fallbackOrders;
    try {
      const orders = await executeQuery('SELECT * FROM orders');
      
      let lineItems: any[] = [];
      try {
        lineItems = await executeQuery(`
          SELECT oi.*, p.name as name, p.imageUrl as imageUrl 
          FROM order_items oi
          LEFT JOIN products p ON oi.product_id = p.id
        `);
      } catch (e) {
        console.error('[DB Loader] order_items load error:', e);
      }

      return orders.map((o: any) => {
        const items = lineItems
          .filter((li: any) => li.order_id === o.id)
          .map((li: any) => ({
            productId: li.product_id,
            quantity: Number(li.quantity),
            price: Number(li.price),
            name: li.name || 'Product',
            imageUrl: li.imageUrl || ''
          }));

        return {
          ...o,
          items: items.length > 0 ? items : (o.items ? JSON.parse(o.items) : [])
        };
      });
    } catch (err) {
      console.error('[DB Error] getOrders failed:', err);
      return fallbackOrders;
    }
  },

  async getOrderById(id: string): Promise<any | null> {
    if (useFallback) {
      return fallbackOrders.find(o => o.id === id) || null;
    }
    try {
      const rows = await executeQuery('SELECT * FROM orders WHERE id = ?', [id]);
      if (rows.length === 0) return null;
      const o = rows[0];

      let items: any[] = [];
      try {
        const lineItems = await executeQuery(`
          SELECT oi.*, p.name as name, p.imageUrl as imageUrl 
          FROM order_items oi
          LEFT JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = ?
        `, [id]);
        
        items = lineItems.map((li: any) => ({
          productId: li.product_id,
          quantity: Number(li.quantity),
          price: Number(li.price),
          name: li.name || 'Product',
          imageUrl: li.imageUrl || ''
        }));
      } catch (e) {
        console.error('[DB Loader] order_items details check failed:', e);
      }

      return {
        ...o,
        items: items.length > 0 ? items : (o.items ? JSON.parse(o.items) : [])
      };
    } catch (err) {
      console.error('[DB Error] getOrderById failed:', err);
      return fallbackOrders.find(o => o.id === id) || null;
    }
  },

  async createOrder(order: any): Promise<any> {
    const id = order.id || `ord${Date.now()}`;
    const newOrder = {
      id,
      userId: order.userId,
      items: order.items,
      total: Number(order.total),
      shippingAddress: order.shippingAddress,
      city: order.city,
      postalCode: order.postalCode,
      phone: order.phone,
      status: order.status || 'pending',
      createdAt: order.createdAt || new Date().toISOString()
    };

    if (useFallback) {
      fallbackOrders.push(newOrder);
      return newOrder;
    }

    try {
      // 1. Dual-write metadata into orders
      await executeQuery(
        `INSERT INTO orders (id, userId, items, total, shippingAddress, city, postalCode, phone, status, createdAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newOrder.id,
          newOrder.userId,
          JSON.stringify(newOrder.items),
          newOrder.total,
          newOrder.shippingAddress,
          newOrder.city,
          newOrder.postalCode,
          newOrder.phone,
          newOrder.status,
          newOrder.createdAt
        ]
      );

      // 2. Insert into normalized order_items details table (3NF atomic table values)
      try {
        for (const item of newOrder.items) {
          const itemId = `oi${Date.now()}_${Math.floor(Math.random() * 10000)}`;
          await executeQuery(
            'INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES (?, ?, ?, ?, ?)',
            [
              itemId,
              id,
              item.productId || item.id,
              Number(item.quantity || 1),
              Number(item.price || 0)
            ]
          );
        }
      } catch (e) {
        console.error('[DB Mapper] Failed updating order_items list:', e);
      }

      return newOrder;
    } catch (err) {
      console.error('[DB Error] createOrder failed:', err);
      fallbackOrders.push(newOrder);
      return newOrder;
    }
  },

  async updateOrder(id: string, updates: any): Promise<any | null> {
    if (useFallback) {
      const idx = fallbackOrders.findIndex(o => o.id === id);
      if (idx === -1) return null;
      fallbackOrders[idx] = { ...fallbackOrders[idx], ...updates };
      return fallbackOrders[idx];
    }

    try {
      const existing = await this.getOrderById(id);
      if (!existing) return null;

      const merged = { ...existing, ...updates };
      
      // 1. Update orders metadata table
      await executeQuery(
        `UPDATE orders SET userId = ?, items = ?, total = ?, shippingAddress = ?, city = ?, postalCode = ?, phone = ?, status = ?, createdAt = ? WHERE id = ?`,
        [
          merged.userId,
          JSON.stringify(merged.items),
          merged.total,
          merged.shippingAddress,
          merged.city,
          merged.postalCode,
          merged.phone,
          merged.status,
          merged.createdAt,
          id
        ]
      );

      // 2. Re-align order_items (3NF compliance alignment)
      if (updates.items) {
        try {
          await executeQuery('DELETE FROM order_items WHERE order_id = ?', [id]);
          for (const item of merged.items) {
            const itemId = `oi${Date.now()}_${Math.floor(Math.random() * 10000)}`;
            await executeQuery(
              'INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES (?, ?, ?, ?, ?)',
              [
                itemId,
                id,
                item.productId || item.id,
                Number(item.quantity || 1),
                Number(item.price || 0)
              ]
            );
          }
        } catch (e) {
          console.error('[DB Mapper] Failed reordering order_items details list:', e);
        }
      }

      return merged;
    } catch (err) {
      console.error('[DB Error] updateOrder failed:', err);
      const idx = fallbackOrders.findIndex(o => o.id === id);
      if (idx === -1) return null;
      fallbackOrders[idx] = { ...fallbackOrders[idx], ...updates };
      return fallbackOrders[idx];
    }
  },

  async deleteOrder(id: string): Promise<boolean> {
    if (useFallback) {
      const idx = fallbackOrders.findIndex(o => o.id === id);
      if (idx === -1) return false;
      fallbackOrders.splice(idx, 1);
      return true;
    }

    try {
      try {
        await executeQuery('DELETE FROM order_items WHERE order_id = ?', [id]);
      } catch (e) {}
      await executeQuery('DELETE FROM orders WHERE id = ?', [id]);
      return true;
    } catch (err) {
      console.error('[DB Error] deleteOrder failed:', err);
      const idx = fallbackOrders.findIndex(o => o.id === id);
      if (idx === -1) return false;
      fallbackOrders.splice(idx, 1);
      return true;
    }
  },

  // WISHLISTS (Already 3NF)
  async getWishlist(userId: string): Promise<any[]> {
    if (useFallback) {
      const userWishlist = fallbackWishlist.filter(w => w.userId === userId);
      return userWishlist.map(w => {
        return fallbackProducts.find(p => p.id === w.productId);
      }).filter(Boolean);
    }

    try {
      const rows = await executeQuery('SELECT * FROM wishlist WHERE userId = ?', [userId]);
      const result: any[] = [];
      for (const row of rows) {
        const prod = await this.getProductById((row as any).productId);
        if (prod) {
          result.push(prod);
        }
      }
      return result;
    } catch (err) {
      console.error('[DB Error] getWishlist failed:', err);
      const userWishlist = fallbackWishlist.filter(w => w.userId === userId);
      return userWishlist.map(w => {
        return fallbackProducts.find(p => p.id === w.productId);
      }).filter(Boolean);
    }
  },

  async getWishlistIds(userId: string): Promise<string[]> {
    if (useFallback) {
      return fallbackWishlist.filter(w => w.userId === userId).map(w => w.productId);
    }

    try {
      const rows = await executeQuery('SELECT productId FROM wishlist WHERE userId = ?', [userId]);
      return rows.map((r: any) => r.productId);
    } catch (err) {
      console.error('[DB Error] getWishlistIds failed:', err);
      return fallbackWishlist.filter(w => w.userId === userId).map(w => w.productId);
    }
  },

  async addToWishlist(userId: string, productId: string): Promise<boolean> {
    const id = `wl${Date.now()}`;
    if (useFallback) {
      const existing = fallbackWishlist.find(w => w.userId === userId && w.productId === productId);
      if (!existing) {
        fallbackWishlist.push({ id, userId, productId });
      }
      return true;
    }

    try {
      const existing = await executeQuery('SELECT * FROM wishlist WHERE userId = ? AND productId = ?', [userId, productId]);
      if (existing.length === 0) {
        await executeQuery('INSERT INTO wishlist (id, userId, productId) VALUES (?, ?, ?)', [id, userId, productId]);
      }
      return true;
    } catch (err) {
      console.error('[DB Error] addToWishlist failed:', err);
      const existing = fallbackWishlist.find(w => w.userId === userId && w.productId === productId);
      if (!existing) {
        fallbackWishlist.push({ id, userId, productId });
      }
      return true;
    }
  },

  async removeFromWishlist(userId: string, productId: string): Promise<boolean> {
    if (useFallback) {
      const idx = fallbackWishlist.findIndex(w => w.userId === userId && w.productId === productId);
      if (idx !== -1) {
        fallbackWishlist.splice(idx, 1);
      }
      return true;
    }

    try {
      await executeQuery('DELETE FROM wishlist WHERE userId = ? AND productId = ?', [userId, productId]);
      return true;
    } catch (err) {
      console.error('[DB Error] removeFromWishlist failed:', err);
      const idx = fallbackWishlist.findIndex(w => w.userId === userId && w.productId === productId);
      if (idx !== -1) {
        fallbackWishlist.splice(idx, 1);
      }
      return true;
    }
  },

  // CART (3NF Table)
  async getCart(userId: string): Promise<any[]> {
    if (useFallback) {
      const userCart = fallbackCart.filter(c => c.userId === userId);
      const results: any[] = [];
      for (const item of userCart) {
        const prod = fallbackProducts.find(p => p.id === item.productId);
        if (prod) {
          results.push({ ...prod, quantity: item.quantity });
        }
      }
      return results;
    }

    try {
      const rows = await executeQuery('SELECT * FROM cart WHERE userId = ?', [userId]);
      const result: any[] = [];
      for (const row of rows) {
        const prod = await this.getProductById((row as any).productId);
        if (prod) {
          result.push({
            ...prod,
            quantity: Number((row as any).quantity)
          });
        }
      }
      return result;
    } catch (err) {
      console.error('[DB Error] getCart failed:', err);
      const userCart = fallbackCart.filter(c => c.userId === userId);
      const results: any[] = [];
      for (const item of userCart) {
        const prod = fallbackProducts.find(p => p.id === item.productId);
        if (prod) {
          results.push({ ...prod, quantity: item.quantity });
        }
      }
      return results;
    }
  },

  async addToCart(userId: string, productId: string, quantity: number): Promise<boolean> {
    const id = `cart_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    if (useFallback) {
      const existing = fallbackCart.find(c => c.userId === userId && c.productId === productId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        fallbackCart.push({ id, userId, productId, quantity });
      }
      return true;
    }

    try {
      await executeQuery(
        `INSERT INTO cart (id, userId, productId, quantity) 
         VALUES (?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
        [id, userId, productId, quantity]
      );
      return true;
    } catch (err) {
      console.error('[DB Error] addToCart failed:', err);
      const existing = fallbackCart.find(c => c.userId === userId && c.productId === productId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        fallbackCart.push({ id, userId, productId, quantity });
      }
      return true;
    }
  },

  async updateCartQuantity(userId: string, productId: string, quantity: number): Promise<boolean> {
    if (quantity <= 0) {
      return this.removeFromCart(userId, productId);
    }

    if (useFallback) {
      const existing = fallbackCart.find(c => c.userId === userId && c.productId === productId);
      if (existing) {
        existing.quantity = quantity;
      }
      return true;
    }

    try {
      await executeQuery(
        'UPDATE cart SET quantity = ? WHERE userId = ? AND productId = ?',
        [quantity, userId, productId]
      );
      return true;
    } catch (err) {
      console.error('[DB Error] updateCartQuantity failed:', err);
      const existing = fallbackCart.find(c => c.userId === userId && c.productId === productId);
      if (existing) {
        existing.quantity = quantity;
      }
      return true;
    }
  },

  async removeFromCart(userId: string, productId: string): Promise<boolean> {
    if (useFallback) {
      const idx = fallbackCart.findIndex(c => c.userId === userId && c.productId === productId);
      if (idx !== -1) {
        fallbackCart.splice(idx, 1);
      }
      return true;
    }

    try {
      await executeQuery('DELETE FROM cart WHERE userId = ? AND productId = ?', [userId, productId]);
      return true;
    } catch (err) {
      console.error('[DB Error] removeFromCart failed:', err);
      const idx = fallbackCart.findIndex(c => c.userId === userId && c.productId === productId);
      if (idx !== -1) {
        fallbackCart.splice(idx, 1);
      }
      return true;
    }
  },

  async clearCart(userId: string): Promise<boolean> {
    if (useFallback) {
      const indices = [];
      for (let i = 0; i < fallbackCart.length; i++) {
        if (fallbackCart[i].userId === userId) {
          indices.push(i);
        }
      }
      for (let i = indices.length - 1; i >= 0; i--) {
        fallbackCart.splice(indices[i], 1);
      }
      return true;
    }

    try {
      await executeQuery('DELETE FROM cart WHERE userId = ?', [userId]);
      return true;
    } catch (err) {
      console.error('[DB Error] clearCart failed:', err);
      const indices = [];
      for (let i = 0; i < fallbackCart.length; i++) {
        if (fallbackCart[i].userId === userId) {
          indices.push(i);
        }
      }
      for (let i = indices.length - 1; i >= 0; i--) {
        fallbackCart.splice(indices[i], 1);
      }
      return true;
    }
  },

  async syncCart(userId: string, items: any[]): Promise<boolean> {
    if (useFallback) {
      await this.clearCart(userId);
      for (const item of items) {
        fallbackCart.push({
          id: `cart_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          userId,
          productId: item.id || item.productId,
          quantity: item.quantity
        });
      }
      return true;
    }

    try {
      await executeQuery('DELETE FROM cart WHERE userId = ?', [userId]);
      for (const item of items) {
        const prodId = item.id || item.productId;
        const id = `cart_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        await executeQuery(
          'INSERT INTO cart (id, userId, productId, quantity) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE quantity = ?',
          [id, userId, prodId, item.quantity, item.quantity]
        );
      }
      return true;
    } catch (err) {
      console.error('[DB Error] syncCart failed:', err);
      await this.clearCart(userId);
      for (const item of items) {
        fallbackCart.push({
          id: `cart_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          userId,
          productId: item.id || item.productId,
          quantity: item.quantity
        });
      }
      return true;
    }
  }
};
