const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'juwan.stiedemann76@ethereal.email',
        pass: 'fMR3N4E5kHVCHt6KJA'
    }
});

module.exports = transporter;

