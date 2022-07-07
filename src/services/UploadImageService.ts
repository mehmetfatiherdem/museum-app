import { v2 as cloudinary } from 'cloudinary';

class UploadImageService {
  constructor(private image: string) {
    cloudinary.config({
      secure: true,
    });
    this.image = image;
  }

  public async call() {
    const result = await cloudinary.uploader.upload(this.image, {
      use_filename: true,
      unique_filename: false,
      folder: '/museums',
      overwrite: true,
    });

    return result;
  }

  public async getImageInfo(publicId) {
    const result = await cloudinary.api.resource(publicId, {
      colors: true,
    });

    return result.url;
  }
}

export default UploadImageService;
