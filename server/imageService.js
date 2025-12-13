import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Gallery image dimensions (square for gallery grid)
const GALLERY_WIDTH = 500;
const GALLERY_HEIGHT = 500;

export const processAndSaveImage = async (buffer, filename) => {
  try {
    const timestamp = Date.now();
    const sanitizedFilename = `${timestamp}-${filename.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    const filepath = path.join(uploadsDir, sanitizedFilename);

    // Save image as-is (client-side cropping is applied)
    fs.writeFileSync(filepath, buffer);

    return {
      success: true,
      filename: sanitizedFilename,
      url: `/uploads/${sanitizedFilename}`,
      width: GALLERY_WIDTH,
      height: GALLERY_HEIGHT,
    };
  } catch (error) {
    console.error('Error processing image:', error);
    return { success: false, error: error.message };
  }
};

export const cropImage = async (buffer, cropData) => {
  try {
    // Image cropping is handled client-side now
    // Just return the buffer
    return { success: true, buffer };
  } catch (error) {
    console.error('Error cropping image:', error);
    return { success: false, error: error.message };
  }
};

export const getGalleryDimensions = () => {
  return { width: GALLERY_WIDTH, height: GALLERY_HEIGHT };
};

export const deleteImage = async (filename) => {
  try {
    const filepath = path.join(uploadsDir, filename);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      return { success: true };
    }
    return { success: false, error: 'File not found' };
  } catch (error) {
    console.error('Error deleting image:', error);
    return { success: false, error: error.message };
  }
};

export const getGalleryImages = async () => {
  try {
    const files = fs.readdirSync(uploadsDir);
    const images = files
      .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
      .map(file => ({
        filename: file,
        url: `/uploads/${file}`,
      }));

    return { success: true, images };
  } catch (error) {
    console.error('Error reading gallery images:', error);
    return { success: false, error: error.message };
  }
};
