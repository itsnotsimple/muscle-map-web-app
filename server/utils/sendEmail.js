const nodemailer = require('nodemailer');


const sendEmail = async (options) => {
    try {
        let transporter;

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            // Използване на реални пощенски данни от .env
            transporter = nodemailer.createTransport({
                service: process.env.EMAIL_SERVICE || 'Gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });
        } else {
            // Използване на тестови Ethereal акаунт, ако няма реални
            console.log("⚠️ Creating temporary Ethereal test inbox...");
            let testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false, 
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });
        }

        const mailOptions = {
            from: `Muscle Map <${process.env.EMAIL_USER || 'noreply@musclemap.com'}>`,
            to: options.to,
            subject: options.subject,
            html: options.html,
            ...(options.replyTo && { replyTo: options.replyTo }),
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("📧 Email sent: %s", info.messageId);

        if (!process.env.EMAIL_USER) {
            console.log("🌐 View Email Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }

    } catch (error) {
        console.error("❌ Transporter Error:", error);
        throw error;
    }
};

module.exports = sendEmail;
