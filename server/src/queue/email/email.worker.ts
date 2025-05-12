import { transport } from "../../config/nodemailer.js";
import { Job, Worker } from "bullmq";
import { verificationEmailTemplate } from "../../template/emailTemplate.js";
import connection from "../../config/valkey.js";


const sendMail = async (email: string, content: string) => {
  const mail = await transport.sendMail({
    from: process.env.DEV_MAIL_ADDRESS,
    to: email,
    subject: "QRBites account verification",
    html: content,
  });
  return mail.messageId;
};

const emailWorker = new Worker(
  "email-queue",
  async (job: Job<VerificationEmail>) => {
    const data = job.data;
    await sendMail(
      data.email,
      verificationEmailTemplate(data.verificationToken, data.email, data.party)
    );
  },
  {connection: connection}
);
