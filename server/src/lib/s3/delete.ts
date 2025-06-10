import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../../config/s3.js";
import { BucketNames } from "./upload.js";

export async function deleteS3Image(
    fileName: string,
    bucketName: BucketNames
): Promise<Error | null> {
  try {
    await s3.send(
      new DeleteObjectCommand({
        Key: fileName,
        Bucket: bucketName,
      })
    );
    return null;
  } catch (error) {
    const err = error as Error;
    return err
  }
}
