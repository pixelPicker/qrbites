import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../../config/s3.js";

export async function uploadRestaurantLogo(upload:Express.Multer.File, filename: string) {
  await s3.send(
      new PutObjectCommand({
        Key: filename,
        Bucket: "qrbites-restaurant-logo",
        ContentType: upload.mimetype,
        Body: upload.buffer,
      })
    );
}