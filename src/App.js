import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: null
    };
  }
  async handleSubmit(event) {
    event.preventDefault();
    const { target: form } = event;
    const data = {
      name: form.name.value,
      email: form.email.value,
      receiveUpdates: form.receiveUpdates.checked,
      message: form.message.value
    };

    const response = await (await fetch(form.action, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(data)
    })).json();

    this.setState({
      message: response.message
    });
  }

  render() {
    const { message } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {message ? (
            <div className="notification" role="alert">
              {message}
            </div>
          ) : (
            ''
          )}

          <form
            action="/.netlify/functions/contact/"
            onSubmit={this.handleSubmit.bind(this)}
          >
            <label>
              <span>Name</span>
              <input
                name="name"
                type="text"
                required
                defaultValue="Stefan Judis"
              />
            </label>
            <label>
              <span>Email</span>
              <input
                name="email"
                type="email"
                required
                defaultValue="stefanjudis@gmail.com"
              />
            </label>
            <label>
              <span>Wanna receive updates?</span>
              <input name="receiveUpdates" type="checkbox" defaultChecked />
            </label>
            <label>
              <span>Your message</span>
              <textarea name="message" />
            </label>

            <button type="submit">Send message</button>
          </form>
        </header>
      </div>
    );
  }
}

export default App;
