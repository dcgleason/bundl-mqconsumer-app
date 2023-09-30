const amqp = require('amqplib/callback_api');
const sendEmail = require('./utils/sendEmail'); // Import your sendEmail function

// Use your specific AmazonMQ AMQP endpoint
const amazonMqUrl = 'amqps://b-5b5885c9-d33b-41aa-94fc-faad831a859f.mq.us-east-1.amazonaws.com:5671';

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
