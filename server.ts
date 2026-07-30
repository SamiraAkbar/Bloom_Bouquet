import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { db, bootstrapDB } from "./src/lib/db.js";

// Load dotenv
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "bloom_secret_123";
const PORT = 3000;

async function startServer() {
  // Bootstrap Alwaysdata tables
  await bootstrapDB();

  const app = express();
  
  app.use(express.json());
  app.use(cookieParser());

  // Middlewares
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ message: 'Forbidden' });
      req.user = user;
      next();
    });
  };

  const requireAdmin = (req: any, res: any, next: any) => {
    if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
    next();
  };

  // Auth Routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const existingUser = await db.getUserByEmail(email);
      if (existingUser) return res.status(400).json({ message: 'Email already exists' });
      
      const newUser = await db.createUser({
        name,
        email, 
        password: bcrypt.hashSync(password, 8),
        role: 'user'
      });
      
      const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ token, user: { id: newUser.id, name, email, role: newUser.role } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to register' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await db.getUserByEmail(email);
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ 
        token, 
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          role: user.role,
          phone: user.phone || '',
          address: user.address || ''
        } 
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to login' });
    }
  });

  app.get('/api/auth/profile', authenticateToken, async (req: any, res) => {
    try {
      const user = await db.getUserById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json({ 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        phone: user.phone || '', 
        address: user.address || '' 
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.put('/api/auth/profile', authenticateToken, async (req: any, res) => {
    try {
      const { name, email, phone, address, currentPassword, newPassword } = req.body;
      const user = await db.getUserById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      if (email && email !== user.email) {
        const emailConflict = await db.getUserByEmail(email);
        if (emailConflict) {
          return res.status(400).json({ message: 'Email already in use' });
        }
      }

      const updates: any = {};

      if (newPassword) {
        if (!currentPassword) {
          return res.status(400).json({ message: 'Current password is required to change password' });
        }
        if (!bcrypt.compareSync(currentPassword, user.password)) {
          return res.status(400).json({ message: 'Incorrect current password' });
        }
        updates.password = bcrypt.hashSync(newPassword, 8);
      }

      if (name) updates.name = name;
      if (email) updates.email = email;
      if (phone !== undefined) updates.phone = phone;
      if (address !== undefined) updates.address = address;

      const updatedUser = await db.updateUser(req.user.id, updates);

      res.json({
        message: 'Profile updated successfully',
        user: { 
          id: updatedUser.id, 
          name: updatedUser.name, 
          email: updatedUser.email, 
          role: updatedUser.role, 
          phone: updatedUser.phone || '', 
          address: updatedUser.address || '' 
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Product Routes
  app.get('/api/products', async (req, res) => {
    try {
      const plist = await db.getProducts();
      res.json(plist);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch products' });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const product = await db.getProductById(req.params.id);
      if (!product) return res.status(404).json({ message: 'Not found' });
      res.json(product);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch product' });
    }
  });

  app.post('/api/products', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { name, price, category, categories, imageUrl, description, inStock } = req.body;
      const newProduct = await db.createProduct({
        name,
        price: Number(price),
        category: category || '',
        categories: categories || [],
        imageUrl,
        description,
        inStock: inStock !== undefined ? Boolean(inStock) : true
      });
      res.json(newProduct);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to create product' });
    }
  });

  app.put('/api/products/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { name, price, category, categories, imageUrl, description, inStock } = req.body;
      const product = await db.getProductById(req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      
      const updated = await db.updateProduct(req.params.id, {
        name: name ?? product.name,
        price: price !== undefined ? Number(price) : product.price,
        category: category ?? product.category,
        categories: categories ?? product.categories,
        imageUrl: imageUrl ?? product.imageUrl,
        description: description ?? product.description,
        inStock: inStock !== undefined ? Boolean(inStock) : product.inStock
      });
      
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to update product' });
    }
  });

  app.delete('/api/products/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const success = await db.deleteProduct(req.params.id);
      if (!success) return res.status(404).json({ message: 'Product not found' });
      res.json({ message: 'Product deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to delete product' });
    }
  });

  // Category Routes
  app.get('/api/categories', async (req, res) => {
    try {
      const clist = await db.getCategories();
      res.json(clist);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch categories' });
    }
  });

  app.post('/api/categories', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) return res.status(400).json({ message: 'Name is required' });
      const newCategory = await db.createCategory({ name });
      res.json(newCategory);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to create category' });
    }
  });

  app.put('/api/categories/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) return res.status(400).json({ message: 'Name is required' });
      const updatedCat = await db.updateCategory(req.params.id, { name });
      if (!updatedCat) return res.status(404).json({ message: 'Not found' });
      res.json(updatedCat);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to update category' });
    }
  });

  app.delete('/api/categories/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const success = await db.deleteCategory(req.params.id);
      if (!success) return res.status(404).json({ message: 'Not found' });
      res.json({ message: 'Deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to delete category' });
    }
  });

  // Order Routes
  app.post('/api/orders', authenticateToken, async (req: any, res) => {
    try {
      const { items, shippingAddress, city, postalCode, phone } = req.body;
      const total = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
      
      const newOrder = await db.createOrder({
        userId: req.user.id,
        items, 
        total, 
        shippingAddress, 
        city, 
        postalCode, 
        phone,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      res.json(newOrder);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to place order' });
    }
  });

  app.get('/api/orders/my-orders', authenticateToken, async (req: any, res) => {
    try {
      const allOrders = await db.getOrders();
      const userOrders = allOrders.filter(o => o.userId === req.user.id);
      res.json(userOrders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch user orders' });
    }
  });

  app.put('/api/orders/:id/cancel-request', authenticateToken, async (req: any, res: any) => {
    try {
      const order = await db.getOrderById(req.params.id);
      if (!order || order.userId !== req.user.id) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      if (order.status !== 'pending') {
        return res.status(400).json({ message: 'Only pending orders can be cancelled' });
      }
      
      const updated = await db.updateOrder(req.params.id, { status: 'cancel_requested' });
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to request cancellation' });
    }
  });

  // Wishlist Routes
  app.get('/api/wishlist', authenticateToken, async (req: any, res: any) => {
    try {
      const list = await db.getWishlist(req.user.id);
      res.json(list);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch wishlist' });
    }
  });

  app.get('/api/wishlist/ids', authenticateToken, async (req: any, res: any) => {
    try {
      const ids = await db.getWishlistIds(req.user.id);
      res.json(ids);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch wishlist IDs' });
    }
  });

  app.post('/api/wishlist', authenticateToken, async (req: any, res: any) => {
    try {
      const { productId } = req.body;
      await db.addToWishlist(req.user.id, productId);
      res.json({ message: 'Added to wishlist' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to add to wishlist' });
    }
  });

  app.delete('/api/wishlist/:productId', authenticateToken, async (req: any, res: any) => {
    try {
      await db.removeFromWishlist(req.user.id, req.params.productId);
      res.json({ message: 'Removed from wishlist' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to remove from wishlist' });
    }
  });

  // Cart Routes (3NF Persistent storage integration)
  app.get('/api/cart', authenticateToken, async (req: any, res: any) => {
    try {
      const list = await db.getCart(req.user.id);
      res.json(list);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch cart' });
    }
  });

  app.post('/api/cart', authenticateToken, async (req: any, res: any) => {
    try {
      const { productId, quantity } = req.body;
      await db.addToCart(req.user.id, productId, Number(quantity || 1));
      res.json({ message: 'Added/Updated cart item' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to add to cart' });
    }
  });

  app.put('/api/cart/:productId', authenticateToken, async (req: any, res: any) => {
    try {
      const { quantity } = req.body;
      await db.updateCartQuantity(req.user.id, req.params.productId, Number(quantity));
      res.json({ message: 'Updated cart item quantity' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to update cart quantity' });
    }
  });

  app.delete('/api/cart/:productId', authenticateToken, async (req: any, res: any) => {
    try {
      await db.removeFromCart(req.user.id, req.params.productId);
      res.json({ message: 'Removed from cart' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to remove from cart' });
    }
  });

  app.delete('/api/cart', authenticateToken, async (req: any, res: any) => {
    try {
      await db.clearCart(req.user.id);
      res.json({ message: 'Cleared cart' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to clear cart' });
    }
  });

  app.post('/api/cart/sync', authenticateToken, async (req: any, res: any) => {
    try {
      const { items } = req.body;
      await db.syncCart(req.user.id, items || []);
      res.json({ message: 'Cart synced with server successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to sync cart' });
    }
  });

  // Admin Routes
  app.get('/api/orders', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const ordersList = await db.getOrders();
      const usersList = await db.getUsers();
      
      const ordersWithUsers = ordersList.map(order => {
        const u = usersList.find(user => user.id === order.userId);
        return {
          ...order,
          customerEmail: u ? u.email : '',
          customerName: u ? u.name : '',
          customerPhone: order.phone || (u ? u.phone : '') || ''
        };
      });
      res.json(ordersWithUsers);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch orders' });
    }
  });

  app.get('/api/orders/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const order = await db.getOrderById(req.params.id);
      if (!order) return res.status(404).json({ message: 'Order not found' });
      const u = await db.getUserById(order.userId);
      res.json({
        ...order,
        customerEmail: u ? u.email : '',
        customerName: u ? u.name : '',
        customerPhone: order.phone || (u ? u.phone : '') || ''
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch order details' });
    }
  });

  app.put('/api/orders/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { status, shippingAddress, city, postalCode, phone } = req.body;
      const order = await db.getOrderById(req.params.id);
      if (!order) return res.status(404).json({ message: 'Order not found' });
      
      const updates: any = {};
      if (status) updates.status = status;
      if (shippingAddress) updates.shippingAddress = shippingAddress;
      if (city) updates.city = city;
      if (postalCode) updates.postalCode = postalCode;
      if (phone) updates.phone = phone;

      const updated = await db.updateOrder(req.params.id, updates);
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to update order' });
    }
  });

  app.delete('/api/orders/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const success = await db.deleteOrder(req.params.id);
      if (!success) return res.status(404).json({ message: 'Order not found' });
      res.json({ message: 'Order deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to delete order' });
    }
  });

  // Admin User Management Routes
  app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const usersList = await db.getUsers();
      const sanitizedUsers = usersList.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        phone: u.phone || '',
        address: u.address || ''
      }));
      res.json(sanitizedUsers);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch admin users list' });
    }
  });

  app.post('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { name, email, password, role, phone, address } = req.body;
      if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Name, email, password, and role are required' });
      }

      const existing = await db.getUserByEmail(email);
      if (existing) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      const newUser = await db.createUser({
        name,
        email,
        password: bcrypt.hashSync(password, 8),
        role: role === 'admin' ? 'admin' : 'user',
        phone: phone || '',
        address: address || ''
      });

      res.json({
        message: 'User created successfully',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          phone: newUser.phone || '',
          address: newUser.address || ''
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to create user' });
    }
  });

  app.put('/api/admin/users/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { name, email, password, role, phone, address } = req.body;
      const user = await db.getUserById(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      if (email && email !== user.email) {
        const conflict = await db.getUserByEmail(email);
        if (conflict) {
          return res.status(400).json({ message: 'Email already in use' });
        }
      }

      const updates: any = {};
      if (name) updates.name = name;
      if (email) updates.email = email;
      if (role) updates.role = role === 'admin' ? 'admin' : 'user';
      if (phone !== undefined) updates.phone = phone;
      if (address !== undefined) updates.address = address;
      if (password) {
        updates.password = bcrypt.hashSync(password, 8);
      }

      const updated = await db.updateUser(req.params.id, updates);

      res.json({
        message: 'User updated successfully',
        user: {
          id: updated.id,
          name: updated.name,
          email: updated.email,
          role: updated.role,
          phone: updated.phone || '',
          address: updated.address || ''
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to update user' });
    }
  });

  app.delete('/api/admin/users/:id', authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      if (req.user.id === req.params.id) {
        return res.status(400).json({ message: 'You cannot delete your own admin account' });
      }

      const success = await db.deleteUser(req.params.id);
      if (!success) return res.status(404).json({ message: 'User not found' });

      res.json({ message: 'User deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to delete user' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
