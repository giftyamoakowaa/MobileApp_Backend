import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

// Configure Cloudinary with your credentials
// IMPORTANT: Replace these placeholder values with your actual Cloudinary Cloud Name, API Key, and API Secret
// You get these from your Cloudinary Dashboard after signing up.
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer to use Cloudinary for file storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2, // Pass the configured Cloudinary instance
  params: {
    folder: "book_covers", // This is the folder name in your Cloudinary account where images will be stored
    format: async (req, file) => "jpeg", // Specifies the desired format for the uploaded image (e.g., 'png', 'jpeg', 'webp')
    public_id: (req, file) => `${Date.now()}-${file.originalname.split('.')[0]}`, // Generates a unique public ID for the image in Cloudinary
    // The public_id is what you'll use to reference the image later
  },
});

// Initialize Multer with the Cloudinary storage engine
const upload = multer({ storage: storage });

export default upload;
