# Backend Environment Setup

## Required Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Backend Environment Variables
PORT=6767
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/hobbyswap

# ImgBB API Key for image uploads
# Get your free API key from https://api.imgbb.com/
IMGBB_API_KEY=your_actual_api_key_here
```

## Getting Your ImgBB API Key

1. Go to https://api.imgbb.com/
2. Sign up for a free account
3. Go to your dashboard and copy your API key
4. Replace `your_actual_api_key_here` with your actual key

## Installation

After creating the `.env` file, install the new dependencies:

```bash
cd backend
npm install
```

This will install the new dependencies:

- `multer` - For handling file uploads
- `node-fetch` - For making HTTP requests to ImgBB API

## Testing

Start your backend server:

```bash
npm run dev
```

The image upload endpoint will be available at:
`POST http://localhost:6767/api/users/upload-image`
