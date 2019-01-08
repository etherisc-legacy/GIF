import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SearchFlights from 'components/searchFlights';
import PolicyTable from 'containers/policyTable';
import CardDetails from 'containers/cardDetails';
import PolicyApplied from 'containers/policyApplied';
import Certificate from 'components/certificate';
import Terms from 'components/terms';
import ErrorDialog from 'components/errorDialog';

import * as appActions from 'modules/application/actions';

const views = {
  searchFlights: <SearchFlights />,
  policyTable: <PolicyTable />,
  cardDetails: <CardDetails />,
  policyApplied: <PolicyApplied />,
  certificate: <Certificate />,
  terms: <Terms />,
  errorDialog: <ErrorDialog />,
};

class Wizard extends Component {
  static propTypes = {
    application: PropTypes.shape({
      wizard: PropTypes.shape.isRequired,
    }).isRequired,
    recenter: PropTypes.func.isRequired,
    setCurrentWizardView: PropTypes.func.isRequired,
  }

  componentDidUpdate() {
    this.props.recenter();
  }

  render() {
    const { application, setCurrentWizardView } = this.props;
    const pointer = views[application.currentWizardView];

    const cloneExtensions = {
      application,
      setCurrentWizardView,
    };

    if (pointer instanceof Component ||
      (pointer.type && pointer.type.prototype instanceof Component)) {
      cloneExtensions.ref = 'activeComponent';
    }

    const compToRender = React.cloneElement(pointer, cloneExtensions);

    return (
      <div>{compToRender}</div>
    );
  }
}

export default connect(
  ({application}) => ({application}),
  {
    setCurrentWizardView: appActions.setCurrentWizardView,
  },
)(Wizard);
