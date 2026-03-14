import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { AppError } from '../errors/AppError.js';

// Ensure the upload directory exists
const uploadDir = 'uploads/resumes';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

//  Set up where and how the file is saved
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save to our local folder
  },
  filename: (req, file, cb) => {
    // Create a unique filename: resume-16345345-random.pdf
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `resume-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

//  Only allow PDFs and Word Documents
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Invalid file type! Please upload a PDF or Word document.', 400), false);
  }
};

// Export the configured Multer instance
export const uploadResume = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter
});