// API base URL - uses environment variable or defaults to localhost
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
  // Auth
  ADMIN_LOGIN: `${API_URL}/api/admin/login`,

  // Products
  PRODUCTS: `${API_URL}/api/products`,
  ADMIN_PRODUCTS: `${API_URL}/api/admin/products`,

  // Gallery
  GALLERY_IMAGES: `${API_URL}/api/gallery-images`,
  ADMIN_GALLERY_DIMENSIONS: `${API_URL}/api/admin/gallery-dimensions`,
  ADMIN_UPLOAD_IMAGE: `${API_URL}/api/admin/upload-image`,
  ADMIN_CROP_IMAGE: `${API_URL}/api/admin/crop-image`,
  ADMIN_DELETE_IMAGE: `${API_URL}/api/admin/delete-image`,

  // Email
  SEND_CONTACT: `${API_URL}/api/send-contact`,
  SEND_BULK_ORDER: `${API_URL}/api/send-bulk-order`,
  ADMIN_EMAIL_CONFIG: `${API_URL}/api/admin/email-config`,

  // Contact Details
  CONTACT_DETAILS: `${API_URL}/api/contact-details`,
  ADMIN_CONTACT_DETAILS: `${API_URL}/api/admin/contact-details`,
};
