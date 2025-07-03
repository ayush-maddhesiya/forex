import { v2 as cloudinary } from 'cloudinary';




const CLOUDINARY_CLOUD_NAME = "dodsa96xk"
const CLOUDINARY_API_KEY = "719334955934437"
const CLOUDINARY_API_SECRET = "7i0fNNVhpcMMlDzo4eDG6hSKlJM"

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});

export default cloudinary; 