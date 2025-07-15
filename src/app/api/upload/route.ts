
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(request: Request) {
  try {
    // Check Cloudinary credentials
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json({ error: 'Cloudinary credentials are not set in environment variables.' }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
  
    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    // Only allow JPG or PNG image uploads
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      return NextResponse.json({ error: 'Only JPG or PNG files are allowed.' }, { status: 400 });
    }

    const fileExtension = path.extname(file.name);
    const public_id = path.basename(file.name, fileExtension);

    const bytes = await file.arrayBuffer();
    if (!bytes || !(bytes instanceof ArrayBuffer)) {
      return NextResponse.json({ error: 'Failed to read file buffer.' }, { status: 400 });
    }
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary as image
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          use_filename: true,
          public_id: public_id,
          overwrite: true,
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    if (!(uploadResult as any)?.secure_url) {
      return NextResponse.json({ error: 'Cloudinary did not return a URL.' }, { status: 500 });
    }

    return NextResponse.json({ url: (uploadResult as any).secure_url }, { status: 200 });
  
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return NextResponse.json({ error: 'Upload failed.' }, { status: 500 });
  }
}
