require('dotenv').config(); // Make sure you have this line to load environment variables
const amqp = require('amqplib/callback_api');
const sendEmail = require('./utils/sendEmail');

// Use environment variable for AmazonMQ URL
const amazonMqUrl = process.env.AMAZON_MQ_URL;

amqp.connect(amazonMqUrl, (error, connection) => {
  if (error) throw error;

  connection.createChannel((error, channel) => {
    if (error) throw error;

    const queue = 'emailQueue';

    // Make the queue durable
    channel.assertQueue(queue, { durable: true });

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
