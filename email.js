const nodemailer = require('nodemailer');

require('dotenv').config();

const transport = new nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.BOT_EMAIL,
        pass: process.env.BOT_PASS
    }
});

const email = (options) => {
    return new Promise((res) => {
        transport.sendMail(options, (err, info) => {
            if (err) res(err);
            else res(info.response);
        });
    });
}

module.exports = { email, transport };