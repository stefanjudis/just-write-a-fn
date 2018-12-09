const Mailgun = require('mailgun-js');
const Airtable = require('airtable');

const sendThankYouEmail = async ({ email }) => {
  return new Promise((resolve, reject) => {
    console.log('Sending the email');
    const { MG_API_KEY: apiKey, MG_DOMAIN: domain } = process.env;
    const mailgun = Mailgun({
      apiKey,
      domain
    });

    const mailData = {
      from: 'Stefan Judis <no-reply@stefanjudis.com>',
      to: email,
      subject: 'Thank you for your interest',
      text: "I'll come back to you asap!"
    };

    mailgun.messages().send(mailData, err => {
      if (err) return reject(err);

      resolve();
    });
  });
};

const saveUser = async ({ name, email, message }) => {
  return new Promise((resolve, reject) => {
    const { AT_API_KEY: apiKey, AT_BASE, AT_TABLE } = process.env;

    Airtable.configure({
      apiKey
    });

    const base = Airtable.base(AT_BASE);
    base(AT_TABLE).create({ name, email, message }, err => {
      if (err) return reject(err);

      resolve();
    });
  });
};

exports.handler = async event => {
  try {
    const data = JSON.parse(event.body);

    await sendThankYouEmail(data);

    if (data.receiveUpdates) {
      await saveUser(data);
    }
    // send a thank you email
    // sign person

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Let's become serverless conductors!!!"
      })
    };
  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      body: e.mssage
    };
  }
};
