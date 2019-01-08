import 'assets/stylesheets/styles.global.css';
import 'assets/stylesheets/fonts.global.css';
import 'assets/stylesheets/custom.global.css';
import 'assets/stylesheets/wizard.global.css';
import 'assets/stylesheets/modal.global.css';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ConnectedRouter as Router } from 'react-router-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import Notifications from 'react-notification-system-redux';
import { reqNetworkData } from 'modules/ethereum/actions';
import * as appActions from 'modules/application/actions';
import Background from 'shared/components/background';
import RedirectModal from 'components/redirect/modal';
import Sidebar from 'components/sidebar';
import Footer from 'components/footer';
import Main from 'components/main';
import NotFound from 'components/notFound';
import MyCertificate from 'components/certificate/myCertificate';

class Layout extends Component {
  static propTypes = {
    history: PropTypes.shape({}),
    reqNetworkData: PropTypes.func.isRequired,
    application: PropTypes.shape({}),
    closeRedirectModal: PropTypes.func.isRequired,
    showRedirectModal: PropTypes.func.isRequired,
    network: PropTypes.shape({}),
    redirectModal: PropTypes.func.isRequired,
  }

  componentDidMount = () => {
    if (window.web3) {
      this.props.reqNetworkData();
    }
  }

  render() {
    const {
      notifications,
      application,
      closeRedirectModal,
      showRedirectModal,
      network,
      redirectModal,
    } = this.props;

    return (
      <Router history={this.props.history}>
        <div style={{ height: '100%' }}>
          <Background />

          <div id="outer-container">
            <Sidebar
              network={network}
              showRedirectModal={showRedirectModal}
            />

            <Switch>
              <Route exact path="/" component={Main} />
              <Route path="/certificate/:certificateId" component={MyCertificate} />
              <Route exact path="/404" component={NotFound} />
              <Redirect to="/404" />
            </Switch>

            <Footer showRedirectModal={redirectModal} />
          </div>

          <Notifications notifications={notifications} />
          {application.showRedirectModal &&
            <RedirectModal link={application.redirectTo} handleClose={closeRedirectModal} />}

        </div>
      </Router>
    );
  }
}

export default connect(
  (state) => ({
    notifications: state.notifications,
    application: state.application,
    network: state.ethereum.network,
  }),
  {
    reqNetworkData,
    showRedirectModal: appActions.showRedirectModal,
    closeRedirectModal: appActions.closeRedirectModal,
    redirectModal: appActions.showRedirectModal,
  },
)(Layout);
