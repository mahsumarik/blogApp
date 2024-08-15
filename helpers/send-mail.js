const nodemailer = require("nodemailer");
const config = require("../config");

var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // SSL kullanarak bağlanacaksa true yapın
    auth: {
        user: config.email.username, // Gmail adresiniz
        pass: config.email.password // Uygulama şifresi veya normal şifre
    }
});

module.exports = transporter;
