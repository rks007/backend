import express from "express"
import multer from "multer"
import multerS3 from "multer-s3"
import {S3Client, GetObjectCommand} from "@aws-sdk/client-s3"
import {getSignedUrl} from "@aws-sdk/s3-request-presigner"
import path from "path"
import crypto from "crypto"
import dotenv from "dotenv"

dotenv.config();

const port = process.env.PORT;

const app = express();
app.use(express.json());

// Configure AWS S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'eu-west-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;

//generate unique filename
const generateUniqueFileName = (originalName) => {
    const timeStamp = Date.now();
    const randomString = crypto.randomBytes(6).toString('hex');
    const extension = path.extname(originalName);
    
    return `videos/${timeStamp}-${randomString}${extension}`;
}

//configure multer
const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,

        key: function(req, file, cb) { //set the name of the video file
            const filename = generateUniqueFileName(file.originalname)
            cb(null, filename);
        }

    }),

    limits: {
        fileSize: 1 * 1024 * 1024 * 1024 // 1GB limit
    }

    //optional, niche tum filefilter bhi setup kar sakte hain, jisme sirf videos/... waali files hi jaengi


})

app.get("/health", (req, res) => {
    res.send("server is healthy")
})


//stream upload endpoint
app.post("/upload", upload.single('video'), async(req, res) => {
    try {
        if(!req.file){
            return res.status(400).json({error: "No video file provided"})
        }

        // req.file contains S3 upload information
        res.json({
          success: true,
          message: 'Video uploaded successfully',
          videoUrl: req.file.location, // S3 URL
          fileName: req.file.key,      // S3 key
          originalName: req.file.originalname,
          size: req.file.size,
          etag: req.file.etag
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ 
          error: 'Upload failed', 
          details: error.message 
        });
    }
})

// Get presigned URL for public video access
app.get("/video", async (req, res) => {
    try {
        
        // Construct the full S3 key as filename
        const fileName = req.query.fileName;

        console.log(fileName);
        

        const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: fileName
        })

        // Generate presigned URL (valid for 1 hour)
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


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log('Ready to stream large video files directly to S3!');
});