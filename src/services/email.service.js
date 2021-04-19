const nodemailer = require('nodemailer');

const config = require('../config/config');
const logger = require('../config/logger');

const transport = nodemailer.createTransport(config.email.smtp);

if (config.env !== 'test') {
    transport
        .verify()
        .then(() => logger.info('Email server connection successful'))
        .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

const sendEmail = async (recipient, subject, text) => {
    const message = { from: config.email.from, to: recipient, subject, text };

    await transport.sendMail(message);
};

const sendResetPasswordEmail = async (recipient, token) => {
    const subject = 'Reset Password';
    const resetPasswordUrl = `http://frontend-url/reset-password/?token=${token}`; // REPLACE THIS WITH PROPER WORKING URL
    const text = `Dear user, \nTo reset your password, click on this link: ${resetPasswordUrl} \nIf you did not request any password resets, then ignore this email.`;

    await sendEmail(recipient, subject, text);
};

const sendVerificationEmail = async (recipient, token) => {
    const subject = 'Email Verification';
    const verificationEmailUrl = `http://frontend-url/verify-email?token=${token}`; // REPLACE THIS WITH PROPER WORKING URL
    const text = `Dear user,\nTo verify your email, click on this link: ${verificationEmailUrl}\nIf you did not create an account, then ignore this email.`;

    await sendEmail(recipient, subject, text);
};

module.exports = {
    sendResetPasswordEmail,
    sendVerificationEmail,
};
