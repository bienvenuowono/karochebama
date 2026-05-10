import { Request, Response } from 'express';

class UploadController {
  async uploadFile(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      // req.file contains information about the uploaded file
      // Return the public URL for the file
      const fileUrl = `/uploads/${req.file.filename}`;
      
      res.status(200).json({ 
        url: fileUrl,
        message: 'File uploaded successfully' 
      });
    } catch (error: any) {
      console.error('Error during file upload:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default new UploadController();
