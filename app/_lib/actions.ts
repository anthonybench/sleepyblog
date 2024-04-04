"use server";
import nodemailer from "nodemailer";
import { emailSignature } from "./emailsignature";
import fs from "fs";

const emailSubject = "Isaac Yep; Resume";

const emailBodyOpening = `<h3>Hey! Looking forward to meeting you 👋</h3><p>This email was sent via automation from my personal website <a href="https://sleepyblog.org">✨SleepyBlog✨</a><br/>If this was sent to you by mistake, feel free to ignore it. Otherwise, feel free to reply to this email to schedule with me 🗓️</p><p>See my attached resume for more information on my background, and <a href="https://linkedin.com/in/anthonybench">✨connect with me on LinkedIn✨</a> if you haven't already.</p>`;

export const sendResumeEmail = async (to: string) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "anthonybenchyep@gmail.com",
      pass: process.env.GAP,
    },
  });

  const mailOptions = {
    from: "anthonybenchyep@gmail.com",
    to: to,
    subject: emailSubject,
    html: emailBodyOpening + emailSignature,

    attachments: [
      {
        filename: "Isaac_Yep_Resume.pdf",
        path: "public/assets/general/Isaac_Yep_Resume.pdf",
        // content: fs.createReadStream('public/assets/general/resume.pdf')
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  });
};
