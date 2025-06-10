import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../../config/s3.js";

export type BucketNames = "qrbites-restaurant-logo" | "qrbites-dish-image";

export function getImageUrl(fileName: string, bucketName: BucketNames) {
  return `https://${bucketName}.s3.ap-south-1.amazonaws.com/${fileName}`;
}

export async function uploadImageToS3(
  upload: Express.Multer.File,
  fileName: string,
  bucketName: BucketNames
) {
  try {
    await s3.send(
      new PutObjectCommand({
        Key: fileName,
        Bucket: bucketName,
        ContentType: upload.mimetype,
        Body: upload.buffer,
        ACL: "public-read",
      })
    );
    return null;
  } catch (error) {
    return error as Error;
  }
}
