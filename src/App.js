import React, { Component } from 'react';
import './App.css';

import { createClient } from 'contentful';
import ReactMarkdown from 'react-markdown';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      page: null,
      message: null
    };

    createClient({
      space: 'y8alybrh6clk',
      accessToken:
        'e0257cc25552f4c398b01e411feb2790e211edd8c02845dcf00b1618ce247231'
    })
      .getEntries({
        'sys.id': '6MZC43ULAWQyYGmOu4Ea64'
      })
      .then(({ items }) => {
        this.setState({
          loading: false,
          page: items[0]
        });
      });
  }

  async handleContactSubmit(event) {
    try {
      event.preventDefault();
      const target = event.target;
      const response = await fetch(target.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
          name: target.name.value,
          email: target.email.value,
          receiveUpdates: target.receiveUpdates.checked,
          message: target.message.value
        })
      });

      if (response.status === 201) {
        this.setState({
          message: 'Thank you!'
        });
      } else {
        throw new Error('Something went wront');
      }
    } catch (e) {
      this.setState({
        message: e.message
      });
    }
  }

  render() {
    const { loading, page, message } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }

    return (
      <div className="App">
        <header className="App-header">
          <h1>{page.fields.title}</h1>
        </header>
        <main>
          <ReactMarkdown source={page.fields.body} />
        </main>
        <h2>Contact</h2>
        {message ? <p role="alert">{message}</p> : ''}
        <form
          className="contactForm"
          action="/.netlify/functions/contact"
          method="post"
          onSubmit={this.handleContactSubmit.bind(this)}
        >
          <label>
            <span>Name</span>
            <input type="text" name="name" required />
          </label>

          <label>
            <span>Email</span>
            <input type="email" name="email" required />
          </label>

          <label>
            <span>I want to receive monthly updates</span>
            <input type="checkbox" name="receiveUpdates" />
          </label>

          <label>
            <span>Message</span>
            <textarea name="message" cols="30" rows="10" />
          </label>

          <button type="submit">Send message</button>
        </form>
      </div>
    );
  }
}

export default App;
