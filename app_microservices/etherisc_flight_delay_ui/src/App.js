import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { Card, Text, Button, TextInputField } from 'evergreen-ui';


const LogMessage = (props) => {
  const {from, topic, msg} = JSON.parse(props.msg);

  return <Card elevation={0} backgroundColor="#ebf3fc" paddingLeft={10} paddingRight={10} paddingTop={4} paddingBottom={4} marginTop={10}>
    <div>
      <Text fontSize={14} fontWeight="bold">
      {props.id}. {from}
      </Text>
    </div>
    {topic && <div>
      <Text fontSize={13} fontWeight="bold">
        Topic: {topic}
      </Text>
      <br />
    </div>}
    <div style={{marginTop: 2}}>
      <Text fontSize={13}>
        {msg}
      </Text>
    </div>
  </Card>
}

class App extends Component {
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

  pushLog = msg => {
    this.setState({logs: [msg, ...this.state.logs]});
  }

  componentDidMount() {
    const socket = new WebSocket(location.href.replace(/^http/, 'ws') + 'api/ws');

    socket.onopen = () => this.state.socket = socket;
    socket.onclose = () => this.pushLog(JSON.stringify({app: 'UI', msg: 'WS connection closed'}));
    socket.onmessage = msg => this.pushLog(msg.data);
    socket.onerror = err => {
      console.log(err);
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();

    if (this.state.socket) {
      this.state.socket.send(JSON.stringify({type: 'apply', data: this.state.form}));
    } else {
      this.setState({logs: [{from: 'etherisc_flight_delay_ui', msg: 'WS connection is not established'}]});
    }
  }

  handleChange = field => (event) => {
    this.setState({form: {...this.state.form, [field]: event.target.value}});
  }

  render() {
    const logs = this.state.logs.map((log, i) => <LogMessage key={i} msg={log} id={this.state.logs.length - i} />);

    return <div>
      <Card display="flex">
        <Card
          backgroundColor="white"
          elevation={2}
          width={'50%'}
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
              value={this.state.form.firstname}
              onChange={this.handleChange('firstname')}
            />

            <TextInputField
              label="Last name"
              placeholder="Enter your last name"
              value={this.state.form.lastname}
              onChange={this.handleChange('lastname')}
            />

            <TextInputField
              label="Email"
              placeholder="Enter your email"
              value={this.state.form.email}
              onChange={this.handleChange('email')}
            />

            <TextInputField
              label="From"
              placeholder="Departure airport, e.g. SFO"
              value={this.state.form.from}
              onChange={this.handleChange('from')}
            />

            <TextInputField
              label="To"
              placeholder="Arrival airport, e.g. ZRH"
              value={this.state.form.to}
              onChange={this.handleChange('to')}
            />

            <TextInputField
              label="Date of departure"
              placeholder="Enter date of departure, e.g. 2018-09-01"
              value={this.state.form.date}
              onChange={this.handleChange('date')}
            />

            <Button appearance="green" float="right" type="submit">Apply</Button>
          </form>
        </Card>

        <Card
          backgroundColor="#153656"
          color="white"
          elevation={2}
          width={'50%'}
          margin={24}
          display="flex"
          padding={24}
          flexDirection="column"
        >
          <Text color="white">App logs</Text>

          <Card height={570} overflow="scroll">
            {logs}
          </Card>
        </Card>
      </Card>
    </div>;
  }
}

export default hot(module)(App);
