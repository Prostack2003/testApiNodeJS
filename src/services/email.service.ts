import nodemailer from 'nodemailer';
import config from '../config';

// Создаём transporter для отправки писем
const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: true, // true для порта 465 (SSL)
    auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
    },
});

async function sendPasswordResetEmail(email: string, token: string) {
    const resetLink = `${config.frontendUrl}/reset-password?token=${token}`;

    const mailOptions = {
        from: config.smtp.from,
        to: email,
        subject: 'Сброс пароля',
        html: `
            <h1>Восстановление пароля</h1>
            <p>Вы запросили сброс пароля. Перейдите по ссылке:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>Ссылка действительна в течение 1 часа.</p>
            <p>Если вы не запрашивали сброс пароля, проигнорируйте это письмо.</p>
        `,
    };

    await transporter.sendMail(mailOptions);
}

export default { sendPasswordResetEmail };