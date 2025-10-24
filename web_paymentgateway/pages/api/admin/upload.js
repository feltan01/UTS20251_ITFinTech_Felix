import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  
  // Buat folder uploads jika belum ada
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    filename: (name, ext, part) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      return `product-${uniqueSuffix}${ext}`;
    },
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(500).json({ error: 'Gagal upload file' });
    }

    const file = files.image;
    if (!file) {
      return res.status(400).json({ error: 'File tidak ditemukan' });
    }

    // Path relatif untuk disimpan di database
    const fileName = path.basename(file[0].filepath);
    const imageUrl = `/uploads/${fileName}`;

    res.status(200).json({ 
      success: true, 
      imageUrl,
      message: 'File berhasil diupload' 
    });
  });
}