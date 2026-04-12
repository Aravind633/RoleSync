import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import { s3Client, S3_BUCKET_NAME } from '../../config/s3.js';
import { AppError } from '../errors/AppError.js';

// S3 Storage — files go directly to your S3 bucket
const storage = multerS3({
  s3: s3Client,
  bucket: S3_BUCKET_NAME,
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => {
    // Create a unique filename: resumes/resume-16345345-random.pdf
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `resumes/resume-${uniqueSuffix}${path.extname(file.originalname)}`;
    cb(null, filename);
  },
  contentType: multerS3.AUTO_CONTENT_TYPE,
});

// Only allow PDFs and Word Documents
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