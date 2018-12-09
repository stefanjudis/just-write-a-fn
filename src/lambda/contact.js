const Mailgun = require('mailgun-js');
const Airtable = require('airtable');

const sendMail = ({ email }) => {
  return new Promise((resolve, reject) => {
    const { MG_API_KEY, MG_DOMAIN } = process.env;
    const mailgun = Mailgun({
      apiKey: MG_API_KEY,
      domain: MG_DOMAIN
    });

    const mailData = {
      from: 'Stefan Judis <noreply@stefanjudis.com>',
      to: email,
      subject: 'Thanks for getting in touch!',
      text: "I'll come back to you asap!"
    };
    mailgun.messages().send(mailData, function(e) {
      if (e) {
        return reject(e);
      }

      resolve();
    });
  });
};

const savePerson = ({ name, email, message }) => {
  return new Promise((resolve, reject) => {
    const { AT_API_KEY, AT_BASE, AT_TABLE } = process.env;
    Airtable.configure({
      endpointUrl: 'https://api.airtable.com',
      apiKey: AT_API_KEY
    });

    const base = Airtable.base(AT_BASE);

    base(AT_TABLE).create({ name: name, email: email, message: message }, e => {
      if (e) {
        return reject(e);
      }
      resolve();
    });
  });
};

exports.handler = async event => {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 403,
        body: 'METHOD "GET" IS NOT ALLOWED'
      };
    }

    const data = JSON.parse(event.body);
    await Promise.all([
      sendMail(data),
      data.receiveUpdates ? savePerson(data) : null
    ]);

    return {
      statusCode: 201,
      body: 'Created'
    };
  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      body: e.message
    };
  }
};
