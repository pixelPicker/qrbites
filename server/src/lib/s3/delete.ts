import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../../config/s3.js";

export async function deleteRestaurantLogo(
  filename: string
) {
  await s3.send(
    new DeleteObjectCommand({
      Key: filename,
      Bucket: "qrbites-restaurant-logo",
    })
  );
}
