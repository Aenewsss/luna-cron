import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        // user: process.env.NODEMAILER_MAIL,
        // pass: process.env.NODEMAILER_PASS,
        user: 'lunareminder@gmail.com',
        pass: 'bcho hmda ixhx slsd',
    },
});

export const sendEmail = async (to, subject, text) => {
    await transporter.sendMail({
        from: 'lunareminder@gmail.com',
        to,
        subject,
        text,
    });
};