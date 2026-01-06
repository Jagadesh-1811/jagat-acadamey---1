import express from 'express';
import { chat } from '../controllers/aiChatController.js';
import isAuth from '../middlewares/isAuth.js';
import multer from 'multer';

const router = express.Router();

// Configure multer for memory storage (we'll process the image in the controller)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// Chat route - handles both text and image messages
router.post('/chat', isAuth, upload.single('image'), chat);

export default router;
