const sgMail = require('@sendgrid/mail');
const Airtable = require('airtable');

const sendThankYouEmail = async ({ email, message }) => {
  return new Promise((resolve, reject) => {
    console.log('Sending the email');

    sgMail.setApiKey(process.env.SG_API_KEY);
    const msg = {
      to: email,
      from: 'no-reply@stefanjudis.com',
      subject: 'Thank you!!!',
      text: "I'll come back to you shortly"
    };

    sgMail.send(msg, false, err => {
      if (err) reject(err);
      resolve();
    });
  });
};

const saveUser = async ({ name, email, message }) => {
  return new Promise((resolve, reject) => {
    const { AT_API_KEY, AT_BASE, AT_TABLE } = process.env;

    const base = new Airtable({ apiKey: AT_API_KEY }).base(AT_BASE);

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

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Thank you for getting in touch!'
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
