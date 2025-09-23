# Express S3 Video Upload with Streaming

A production-ready Express.js server that streams video files directly to AWS S3 and generates presigned URLs for public access.

## 🚀 Features

- **Stream Upload**: Videos are streamed directly to S3 without storing in server memory/disk
- **Memory Efficient**: Handles large files (1GB+) with minimal memory usage
- **Unique File Names**: Prevents file conflicts with timestamp + random string
- **Presigned URLs**: Generate temporary URLs for secure public video access
- **ES6 Modules**: Modern JavaScript syntax with import/export

## 📦 Installation

```bash
npm i express multer multer-s3 @aws-sdk/client-s3 @aws-sdk/s3-request-presigner dotenv
```

## 🔧 Environment Setup

Create a `.env` file:
```env
PORT=3000
AWS_REGION=eu-west-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
S3_BUCKET_NAME=your-bucket-name
```

## 📋 Code Breakdown

### Dependencies & Configuration
```javascript
import express from "express"
import multer from "multer"           // File upload middleware
import multerS3 from "multer-s3"      // Direct S3 upload storage
import {S3Client, GetObjectCommand} from "@aws-sdk/client-s3"
import {getSignedUrl} from "@aws-sdk/s3-request-presigner"
import path from "path"               // File path utilities
import crypto from "crypto"           // For generating random strings
import dotenv from "dotenv"           // Environment variables
```

### AWS S3 Client Setup
```javascript
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'eu-west-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
```
- Creates authenticated S3 client instance
- Falls back to `eu-west-1` if region not specified
- Uses environment variables for security

### Unique File Name Generation
```javascript
const generateUniqueFileName = (originalName) => {
    const timeStamp = Date.now();                    // Current timestamp
    const randomString = crypto.randomBytes(6).toString('hex'); // 12-char random string
    const extension = path.extname(originalName);    // Preserve original extension
    
    return `videos/${timeStamp}-${randomString}${extension}`;
}
```
**Purpose**: Prevents file name conflicts and organizes files in `videos/` folder
**Format**: `videos/1703123456789-a1b2c3d4e5f6.mp4`

### Multer S3 Configuration
```javascript
const upload = multer({
    storage: multerS3({
        s3: s3Client,                          // S3 client instance
        bucket: BUCKET_NAME,                   // Target S3 bucket
        contentType: multerS3.AUTO_CONTENT_TYPE, // Auto-detect MIME type
        
        key: function(req, file, cb) {         // Custom file naming
            const filename = generateUniqueFileName(file.originalname)
            cb(null, filename);                // No error, use generated filename
        }
    }),
    
    limits: {
        fileSize: 1 * 1024 * 1024 * 1024      // 1GB file size limit
    }
});
```
**Key Points**:
- `multerS3` streams files directly to S3 (no temporary storage)
- `AUTO_CONTENT_TYPE` automatically sets correct MIME type
- `key` function determines the S3 object key (file path)
- File size limit prevents abuse

## 🛣️ API Endpoints

### 1. Upload Video - `POST /upload`

**Purpose**: Stream upload video file directly to S3

```javascript
app.post("/upload", upload.single('video'), async(req, res) => {
    try {
        if(!req.file){
            return res.status(400).json({error: "No video file provided"})
        }

        // multerS3 populates req.file with S3 upload details
        res.json({
          success: true,
          message: 'Video uploaded successfully',
          videoUrl: req.file.location,    // Direct S3 URL
          fileName: req.file.key,         // S3 key (includes videos/ prefix)
          originalName: req.file.originalname,
          size: req.file.size,
          etag: req.file.etag            // S3 entity tag for verification
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ 
          error: 'Upload failed', 
          details: error.message 
        });
    }
})
```

**Key Details**:
- `upload.single('video')` expects form field named `video`
- `req.file.location` is the direct S3 URL (if bucket is public)
- `req.file.key` is needed for generating presigned URLs later
- Error handling for missing files and upload failures

**Usage Example**:
```javascript
const formData = new FormData();
formData.append('video', videoFile);

fetch('/upload', {
    method: 'POST',
    body: formData
});
```

### 2. Get Presigned URL - `GET /video?fileName=...`

**Purpose**: Generate temporary URL for secure video access

```javascript
app.get("/video", async (req, res) => {
    try {
        const fileName = req.query.fileName;   // Full S3 key from query param
        
        const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: fileName                      // S3 object key
        })

        // Generate presigned URL valid for 1 hour
        const presignedUrl = await getSignedUrl(s3Client, command, { 
          expiresIn: 3600 
        });

        res.json({
            success: true,
            videoUrl: presignedUrl,
            expiresIn: '1 hour'
        });

    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to generate video URL', 
            details: error.message 
        });
    }
})
```

**Key Details**:
- Uses query parameter instead of path parameter for simplicity
- `GetObjectCommand` creates a command to retrieve the S3 object
- `getSignedUrl()` generates a temporary URL with expiration
- URL expires after 1 hour (3600 seconds) for security

**Usage Example**:
```
GET /video?fileName=videos/1703123456789-a1b2c3d4e5f6.mp4
```

## 🔄 Complete Workflow

1. **Upload Process**:
   ```
   Client → Express Server → S3 (streaming)
                ↓
          Return S3 metadata
   ```

2. **Access Process**:
   ```
   Client → Express Server → Generate presigned URL → Return temporary URL
   ```

## 💡 Production Considerations

### Security Enhancements
```javascript
// Add file type validation
fileFilter: (req, file, cb) => {
    const allowedTypes = ['video/mp4', 'video/mpeg', 'video/quicktime'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only video files allowed'), false);
    }
}
```

### Rate Limiting
```javascript
import rateLimit from 'express-rate-limit';

const uploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 5,                    // 5 uploads per window
    message: 'Too many uploads, try again later'
});

app.post("/upload", uploadLimiter, upload.single('video'), ...);
```

### Authentication
```javascript
const authenticateUser = (req, res, next) => {
    // Verify JWT token or API key
    // Add user context to req.user
    next();
};

app.post("/upload", authenticateUser, upload.single('video'), ...);
```

## 🎯 Benefits of This Approach

1. **Memory Efficient**: Streams data directly to S3, uses minimal RAM
2. **Scalable**: Can handle multiple large uploads simultaneously
3. **Secure**: Presigned URLs provide temporary access without exposing credentials
4. **Fast**: No intermediate storage, direct client → server → S3 flow
5. **Reliable**: AWS S3 handles durability and availability

## 🔗 Usage Flow

1. Upload video: `POST /upload` with form-data
2. Save returned `fileName` from response
3. Generate viewing URL: `GET /video?fileName={saved-fileName}`
4. Use presigned URL in video player or share publicly

This architecture is production-ready and handles large video files efficiently while maintaining security through presigned URLs.