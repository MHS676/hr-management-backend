import { v2 as cloudinary } from 'cloudinary';
import env from './env';

cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
});


export const uploadToCloudinary = (
    fileBuffer: Buffer,
    folder: string = env.CLOUDINARY_FOLDER,
): Promise<string> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream({ folder, resource_type: 'image' }, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result!.secure_url);
                }
            })
            .end(fileBuffer);
    });
};


export const deleteFromCloudinary = async (imageUrl: string): Promise<void> => {
    try {
        
        const parts = imageUrl.split('/');
        const folderAndFile = parts.slice(parts.indexOf('upload') + 2).join('/');
        const publicId = folderAndFile.replace(/\.[^/.]+$/, '');
        await cloudinary.uploader.destroy(publicId);
    } catch {
        
    }
};

export default cloudinary;
