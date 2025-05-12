import { Queue } from "bullmq";
import valkeyConnection from "../../config/valkey.js";

const emailQueue = new Queue<VerificationEmail>("email-queue", {connection: valkeyConnection});

export const addEmailToQueue = async (payload: VerificationEmail) => {
  await emailQueue.add("verification-email", payload);
};
