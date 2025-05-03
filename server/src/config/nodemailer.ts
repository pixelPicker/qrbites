import "dotenv/config"
import nodemailer from "nodemailer";

export const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.DEV_MAIL_ADDRESS,
    pass: process.env.DEV_MAIL_PASSWORD,
  },
});
