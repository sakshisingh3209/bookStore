const sgMail = require('../config/sendgrid');

//send email notifications

const sendEmailNotifications = async(to, subject, text) => {
    try {
        const msg = {
            to,
            from: 'priya@gmail.com',
            subject,
            text,
        };

        await sgMail.send(msg);
        console.log('Notification sent successfully');
    } catch (error) {
        console.error('Error sending notification:', error);
        throw error;
    }
};


module.exports = {
    sendEmailNotifications,
};