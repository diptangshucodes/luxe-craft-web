# Email Setup Guide

This guide explains how to set up email functionality for the contact and bulk order forms.

## Backend Setup

### 1. Install Dependencies

Navigate to the `server` directory and install dependencies:

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `server` directory based on `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` with your email configuration:

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
RECIPIENT_EMAIL=diptangshudo@gmail.com
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

### 3. Gmail Setup (Required for EMAIL_PASSWORD)

If using Gmail:

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Google will generate a 16-character password
   - Use this password as `EMAIL_PASSWORD` in `.env`

For other email providers, use your regular password or check their app-specific password documentation.

### 4. Start the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will run on `http://localhost:3001`

## Frontend Integration

The frontend components have been updated to send form data to the backend:

- **Contact Form** (`HeroSection.tsx`) - Sends to `/api/send-contact`
- **Bulk Order Form** (`BulkOrderSection.tsx`) - Sends to `/api/send-bulk-order`

## API Endpoints

### Send Contact Email

**POST** `/api/send-contact`

Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Your message here"
}
```

Response:
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

### Send Bulk Order Email

**POST** `/api/send-bulk-order`

Request body:
```json
{
  "companyName": "Company Inc",
  "contactName": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "productCategory": "Bags & Briefcases",
  "quantity": "100-500 units",
  "specifications": "Custom specifications here"
}
```

Response:
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

## Running Both Frontend and Backend

You'll need two terminal windows:

**Terminal 1 - Frontend (Vite dev server):**
```bash
npm run dev
```

**Terminal 2 - Backend (Email server):**
```bash
cd server
npm run dev
```

The frontend will run on `http://localhost:5173` and the backend on `http://localhost:3001`.

## Testing

1. Open the website at `http://localhost:5173`
2. Fill out the contact form or bulk order form
3. Submit the form
4. Check that an email is received at `diptangshudo@gmail.com`
5. The form should show a success toast message

## Troubleshooting

- **"Failed to send email"**: Check that the backend server is running on port 3001
- **CORS errors**: Ensure `CORS_ORIGIN` in `.env` matches your frontend URL
- **Email not received**: Verify your email credentials in `.env` are correct
- **"Missing required fields"**: Ensure all required form fields are filled out

## Production Deployment

For production, you'll need to:

1. Deploy the backend server (Node.js) to a hosting service (e.g., Heroku, Vercel, Railway)
2. Update `CORS_ORIGIN` to your production frontend URL
3. Update the fetch URLs in components to use your production backend URL
4. Use environment variables for sensitive email credentials
