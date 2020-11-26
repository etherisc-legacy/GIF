import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StripeProvider, Elements } from 'react-stripe-elements';
import { Card, Text } from 'evergreen-ui';
import CardForm from './cardForm';

/**
 * Formatted log message component
 * @param {{}} params
 * @param {{}} params.msg
 * @param {integer} params.id
 * @return {*}
 * @constructor
 */
const LogMessage = ({ msg, id }) => {
  const { from, topic, msg: message } = JSON.parse(msg);

  return (
    <Card
      elevation={0}
      backgroundColor="#ebf3fc"
      paddingLeft={10}
      paddingRight={10}
      paddingTop={4}
      paddingBottom={4}
      marginTop={10}
    >
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
  msg: PropTypes.string.isRequired,
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
   * @param {{}} data
   */
  handleSubmit = (data) => {
    const { socket } = this.state;
    const {
      firstname, lastname, email, from, to, date, sourceId,
    } = data;

    if (socket) {
      const message = {
        customer: {
          firstname,
          lastname,
          email,
        },
        policy: {
          distributorId: '11111111-1111-1111-1111-111111111111',
          from,
          to,
          date,
        },
        payment: {
          kind: 'fiat',
          currency: 'usd',
          premium: 1500,
          provider: 'stripe',
          sourceId,
        },
      };

      socket.send(JSON.stringify({ type: 'apply', data: message }));
    } else {
      this.setState({ logs: [{ from: 'etherisc_flight_delay_ui', msg: 'WS connection is not established' }] });
    }
  };

  /**
   * Render component
   * @return {*}
   */
  render() {
    const { logs } = this.state;

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

            <StripeProvider apiKey="pk_test_G9CSTZTnASdZHyAlAGlstS6c">
              <Elements>
                <CardForm handleSubmit={this.handleSubmit} />
              </Elements>
            </StripeProvider>
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
