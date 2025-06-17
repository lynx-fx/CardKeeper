const nodeMailer = require('nodemailer');

const transport = nodeMailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    }
})

module.exports = transport;