import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendContactEmail, sendBulkOrderEmail } from './emailService.js';
import { authenticateAdmin, verifyToken } from './authService.js';
import {
  processAndSaveImage,
  cropImage,
  getGalleryDimensions,
  deleteImage,
  getGalleryImages,
} from './imageService.js';
import { initializeDatabase, productDb, emailConfigDb, contactDetailsDb } from './database.js';

dotenv.config();

// Initialize database
initializeDatabase();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|webp)$/i;
    if (allowed.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Middleware
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Contact form endpoint
app.post('/api/send-contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await sendContactEmail({ name, email, message });

    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending contact email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Bulk order form endpoint
app.post('/api/send-bulk-order', async (req, res) => {
  try {
    const {
      companyName,
      contactName,
      email,
      phone,
      productCategory,
      quantity,
      specifications,
    } = req.body;

    // Validation
    if (!companyName || !contactName || !email || !productCategory || !quantity) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await sendBulkOrderEmail({
      companyName,
      contactName,
      email,
      phone,
      productCategory,
      quantity,
      specifications,
    });

    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending bulk order email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// ===== ADMIN ENDPOINTS =====

// Admin login endpoint
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Missing username or password' });
    }

    const result = await authenticateAdmin(username, password);
    if (result.success) {
      res.json({ success: true, token: result.token });
    } else {
      res.status(401).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get gallery dimensions for frontend crop
app.get('/api/admin/gallery-dimensions', (req, res) => {
  const dimensions = getGalleryDimensions();
  res.json(dimensions);
});

// Upload image endpoint
app.post('/api/admin/upload-image', verifyToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const result = await processAndSaveImage(req.file.buffer, req.file.originalname);

    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Crop and save image endpoint
app.post('/api/admin/crop-image', verifyToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const cropData = JSON.parse(req.body.cropData);
    const cropResult = await cropImage(req.file.buffer, cropData);

    if (!cropResult.success) {
      return res.status(500).json({ error: cropResult.error });
    }

    const saveResult = await processAndSaveImage(cropResult.buffer, req.file.originalname);

    if (saveResult.success) {
      res.json(saveResult);
    } else {
      res.status(500).json({ error: saveResult.error });
    }
  } catch (error) {
    console.error('Error cropping image:', error);
    res.status(500).json({ error: 'Crop failed' });
  }
});

// Get all gallery images
app.get('/api/admin/gallery-images', verifyToken, async (req, res) => {
  const result = await getGalleryImages();
  if (result.success) {
    res.json(result.images);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Delete image endpoint
app.delete('/api/admin/delete-image/:filename', verifyToken, async (req, res) => {
  try {
    const { filename } = req.params;
    const result = await deleteImage(filename);

    if (result.success) {
      res.json({ success: true, message: 'Image deleted' });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Delete failed' });
  }
});

// Public endpoint to get gallery images (for website)
app.get('/api/gallery-images', async (req, res) => {
  const result = await getGalleryImages();
  if (result.success) {
    res.json(result.images);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// ===== PRODUCT ENDPOINTS =====

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await productDb.getAll();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await productDb.getById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Get products by category
app.get('/api/products/category/:category', async (req, res) => {
  try {
    const products = await productDb.getByCategory(req.params.category);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Create product (admin only)
app.post('/api/admin/products', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { name, price, category, description } = req.body;

    if (!name || !price || !category || !req.file) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Process and save image
    const imageResult = await processAndSaveImage(req.file.buffer, req.file.originalname);
    if (!imageResult.success) {
      return res.status(500).json({ error: 'Failed to process image' });
    }

    // Create product in database
    const product = await productDb.create({
      name,
      price: parseFloat(price),
      category,
      image_filename: imageResult.filename,
      description: description || '',
    });

    res.json({ success: true, product });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product (admin only)
app.put('/api/admin/products/:id', verifyToken, async (req, res) => {
  try {
    const { name, price, category, description } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const product = await productDb.update(req.params.id, {
      name,
      price: parseFloat(price),
      category,
      description: description || '',
    });

    res.json({ success: true, product });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product (admin only)
app.delete('/api/admin/products/:id', verifyToken, async (req, res) => {
  try {
    const product = await productDb.delete(req.params.id);
    
    // Also delete the image file
    if (product) {
      await deleteImage(product.image_filename);
    }

    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// ===== EMAIL CONFIG ENDPOINTS =====

// Get email config (admin only)
app.get('/api/admin/email-config', verifyToken, async (req, res) => {
  try {
    const config = await emailConfigDb.get();
    // Don't send password to frontend
    const { email_password, ...safeConfig } = config;
    res.json(safeConfig);
  } catch (error) {
    console.error('Error fetching email config:', error);
    res.status(500).json({ error: 'Failed to fetch email config' });
  }
});

// Update email config (admin only)
app.put('/api/admin/email-config', verifyToken, async (req, res) => {
  try {
    const { email_user, email_password, email_host, email_port, recipient_email } = req.body;

    if (!email_user || !email_host || !email_port || !recipient_email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const config = await emailConfigDb.update({
      email_user,
      email_password: email_password || '',
      email_host,
      email_port: parseInt(email_port),
      recipient_email,
    });

    // Don't send password
    const { email_password: _, ...safeConfig } = config;
    res.json({ success: true, config: safeConfig });
  } catch (error) {
    console.error('Error updating email config:', error);
    res.status(500).json({ error: 'Failed to update email config' });
  }
});

// ===== CONTACT DETAILS ENDPOINTS =====

// Get contact details (public and admin)
app.get('/api/contact-details', async (req, res) => {
  try {
    const details = await contactDetailsDb.get();
    res.json(details);
  } catch (error) {
    console.error('Error fetching contact details:', error);
    res.status(500).json({ error: 'Failed to fetch contact details' });
  }
});

// Update contact details (admin only)
app.put('/api/admin/contact-details', verifyToken, async (req, res) => {
  try {
    const { address, phone, email, facebook, instagram, twitter, linkedin, whatsapp } = req.body;

    if (!address || !phone || !email) {
      return res.status(400).json({ error: 'Missing required fields (address, phone, email)' });
    }

    const details = await contactDetailsDb.update({
      address,
      phone,
      email,
      facebook: facebook || '',
      instagram: instagram || '',
      twitter: twitter || '',
      linkedin: linkedin || '',
      whatsapp: whatsapp || '',
    });

    res.json({ success: true, details });
  } catch (error) {
    console.error('Error updating contact details:', error);
    res.status(500).json({ error: 'Failed to update contact details' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`CORS enabled for: ${CORS_ORIGIN}`);
});
