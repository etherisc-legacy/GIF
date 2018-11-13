import 'sanitize.css/sanitize.css';

import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import WebSocketAsPromised from 'websocket-as-promised';
import uuid from 'uuid';


// Components
import Header from 'components/Header';
import Console from 'components/Console';

// Pages
import Catalog from 'containers/Catalog';
import Checkout from 'containers/Checkout';
import Claim from 'containers/Claim';
import Dashboard from 'containers/Dashboard';
import NotFound from 'containers/NotFound';

import GlobalStyles from './global-styles';


const Layout = styled.div`
  display: flex;
  height: 100%;
  width: 70%;
`;

const Content = styled.div`
  flex-grow: 1;
  height: 100%;
`;

const Page = styled.div`
  height: 100%;
`;

/**
 * Root application component
 */
class Root extends Component {
  state = {
    logs: [],
  };

  /**
   * On component mounted livecycle hook
   */
  componentDidMount() {
    this.openWs();
  }

  /**
   * Send a request by WebSocket
   * @param {string} type
   * @param {{}} data
   * @return {*}
   */
  request = (type, data) => {
    if (!window.socket) {
      return Promise.reject();
    }

    return window.socket.sendRequest({ type, data }, { requestId: window.socket.getUniqueID() });
  };

  /**
   * Create WebSocket connection
   */
  openWs = () => {
    const wsp = new WebSocketAsPromised(`${window.location.origin.replace(/^http/, 'ws')}/api/ws`, {
      packMessage: data => JSON.stringify(data),
      unpackMessage: message => JSON.parse(message),
      attachRequestId: (data, requestId) => Object.assign({ id: requestId }, data),
      extractRequestId: data => data && data.id,
    });

    wsp.getUniqueID = () => uuid();

    wsp.open()
      .then(() => {
        window.socket = wsp;
      })
      .catch(e => console.error(e));

    wsp.onError.addListener(console.error);
    wsp.onClose.addListener(() => this.pushLog(JSON.stringify({ app: 'UI', msg: 'WS connection closed' })));
    wsp.onMessage.addListener((msg) => {
      console.log(msg);
      this.pushLog(msg);
    });
  };

  /**
   * Add log message to the list
   * @param {string} msg
   */
  pushLog = (msg) => {
    const { logs } = this.state;
    this.setState({ logs: [msg, ...logs] });
  };

  /**
   * Render component
   * @return {*}
   */
  render() {
    const { logs } = this.state;

    return (
      <Router>
        <Layout>
          <Helmet
            titleTemplate="%s - eStore"
            defaultTitle="eStore"
          >
            <meta name="description" content="Electronic store" />
          </Helmet>
          <GlobalStyles />

          <Content>
            <Header />

            <Page>
              <Switch>
                <Route exact path="/" component={Catalog} />
                <Route exact path="/checkout/:vendorCode" render={props => <Checkout request={this.request} {...props} />} />
                <Route exact path="/claim" render={() => <Claim request={this.request} />} />
                <Route exact path="/dashboard" render={() => <Dashboard request={this.request} />} />
                <Route path="" component={NotFound} />
              </Switch>
            </Page>
          </Content>

          <Console logs={logs} />
        </Layout>
      </Router>
    );
  }
}

export default Root;
