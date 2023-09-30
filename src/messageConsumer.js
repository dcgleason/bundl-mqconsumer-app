const amqp = require('amqplib/callback_api');
const sendEmail = require('./utils/sendEmail'); // Import your sendEmail function

amqp.connect('amqps://your-amazon-mq-url', (error, connection) => {
  if (error) throw error;

  connection.createChannel((error, channel) => {
    if (error) throw error;

    const queue = 'emailQueue';

    channel.assertQueue(queue, { durable: false });

    console.log(`Waiting for messages in queue: ${queue}`);

    channel.consume(queue, (message) => {
      const emailData = JSON.parse(message.content.toString());

      // Extract additional user information if needed
      const { recipients, subject, text, userId, userName, userEmail } = emailData;

      // Call your sendEmail function
      sendEmail(recipients, subject, text, userId, userName, userEmail);

      console.log('Email sent');

    }, { noAck: true });
  });
});
