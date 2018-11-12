import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Card, Text, Button, TextInputField,
} from 'evergreen-ui';

/**
 * Formatted log message component
 * @param {{}} msg
 * @param {numver} id
 * @return {*}
 * @constructor
 */
const LogMessage = ({ msg, id }) => {
  const { from, topic, msg: message } = JSON.parse(msg);

  return (
    <Card elevation={0} backgroundColor="#ebf3fc" paddingLeft={10} paddingRight={10} paddingTop={4} paddingBottom={4} marginTop={10}>
      <div>
        <Text fontSize={14} fontWeight="bold">
          {id}
.
          {from}
        </Text>
      </div>
      {topic && (
      <div>
        <Text fontSize={13} fontWeight="bold">
        Topic:
          {' '}
          {topic}
        </Text>
        <br />
      </div>
      )}
      <div style={{ marginTop: 2 }}>
        <Text fontSize={13}>
          {message}
        </Text>
      </div>
    </Card>
  );
};

LogMessage.propTypes = {
  msg: PropTypes.shape.isRequired,
  id: PropTypes.string.isRequired,
};

/**
 * Layout
 */
class App extends Component {
  /**
   * Constructor
   */
  constructor() {
    super();

    this.state = {
      socket: null,
      logs: [],
      form: {
        firstname: '',
        lastname: '',
        email: '',
        from: '',
        to: '',
        date: '',
      },
    };
  }

  /**
   * ComponentDipMount component's livecycle event
   */
  componentDidMount() {
    const socket = new WebSocket(`${window.location.href.replace(/^http/, 'ws')}api/ws`);

    socket.onopen = () => this.state.socket = socket;
    socket.onclose = () => this.pushLog(JSON.stringify({ app: 'UI', msg: 'WS connection closed' }));
    socket.onmessage = msg => this.pushLog(msg.data);
    socket.onerror = console.log;
  }

  /**
   * Prepend logs message with new message
   * @param {{}} msg
   */
  pushLog = (msg) => {
    const { logs } = this.state;
    this.setState({ logs: [msg, ...logs] });
  };

  /**
   * Handle application form submit event
   * @param {event} event
   */
  handleSubmit = (event) => {
    event.preventDefault();

    const { socket, form } = this.state;

    if (socket) {
      const message = {
        customer: {
          firstname: form.firstname,
          lastname: form.lastname,
          email: form.email,
        },
        policy: {
          distributorId: '11111111-1111-1111-1111-111111111111',
          from: form.from,
          to: form.to,
          date: form.date,
        },
      };

      socket.send(JSON.stringify({ type: 'apply', data: message }));
    } else {
      this.setState({ logs: [{ from: 'etherisc_flight_delay_ui', msg: 'WS connection is not established' }] });
    }
  };

  /**
   * Handle application form field change
   * @param {string} field
   * @return {Function}
   */
  handleChange = field => (event) => {
    const { form } = this.state;

    this.setState({ form: { ...form, [field]: event.target.value } });
  };

  /**
   * Render component
   * @return {*}
   */
  render() {
    const { logs, form } = this.state;

    const {
      firstname, lastname, email, from, to, date,
    } = form;

    const messages = logs.map((log, i) => (
      <LogMessage
        key={Math.random()}
        msg={log}
        id={logs.length - i}
      />
    ));

    return (
      <div>
        <Card display="flex">
          <Card
            backgroundColor="white"
            elevation={2}
            width="50%"
            margin={24}
            display="flex"
            padding={24}
            flexDirection="column"
          >
            <Text marginBottom={20}>Flight Delay Dapp UI</Text>

            <form onSubmit={this.handleSubmit}>
              <TextInputField
                label="First name"
                placeholder="Enter your first name"
                value={firstname}
                onChange={this.handleChange('firstname')}
              />

              <TextInputField
                label="Last name"
                placeholder="Enter your last name"
                value={lastname}
                onChange={this.handleChange('lastname')}
              />

              <TextInputField
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChange={this.handleChange('email')}
              />

              <TextInputField
                label="From"
                placeholder="Departure airport, e.g. SFO"
                value={from}
                onChange={this.handleChange('from')}
              />

              <TextInputField
                label="To"
                placeholder="Arrival airport, e.g. ZRH"
                value={to}
                onChange={this.handleChange('to')}
              />

              <TextInputField
                label="Date of departure"
                placeholder="Enter date of departure, e.g. 2018-09-01"
                value={date}
                onChange={this.handleChange('date')}
              />

              <Button appearance="green" float="right" type="submit">Apply</Button>
            </form>
          </Card>

          <Card
            backgroundColor="#153656"
            color="white"
            elevation={2}
            width="50%"
            margin={24}
            display="flex"
            padding={24}
            flexDirection="column"
          >
            <Text color="white">App logs</Text>

            <Card height={570} overflow="scroll">
              {messages}
            </Card>
          </Card>
        </Card>
      </div>
    );
  }
}

export default App;
