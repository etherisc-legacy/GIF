import React, { Component } from 'react';
import PropsTypes from 'prop-types';
import { connect } from 'react-redux';
import TestModeNotification from 'components/testModeNotifications/testnet';
import Spinner from 'shared/components/spinner';
import { selectFlight } from 'modules/application/actions';
import Steps from 'components/steps';
import Flight from './flight';
import styles from './styles.m.css';
import { translate } from 'react-i18next';

class SearchFlights extends Component {
  static propTypes = {
    application: PropsTypes.shape.isRequired,
    selectFlight: PropsTypes.func.isRequired,
    setCurrentWizardView: PropsTypes.func.isRequired,
  }

  state = {
    selected: {},
  }

  selectFlight = flight => {
    if (!this.props.application.flightSearch.selected) {
      this.setState({selected: flight});
      this.props.selectFlight(flight);
    }
  }


  render() {
    const { application, setCurrentWizardView, t } = this.props;

    const isSearchingFlights = application.flightSearch && application.flightSearch.isSearching;

    const hasFlightsToShow = application.flightSearch &&
      application.flightSearch.error === null &&
      application.flightSearch.flights.length !== 0;

    const flightRatingRequested = application.flight && application.flight.isRatingRequest;

    const flights = hasFlightsToShow && application.flightSearch.flights.map((flight, i) =>
      (<Flight
        key={`${flight.carrier}${flight.flightNumber}`}
        index={i}
        flight={flight}
        selectFlight={this.selectFlight}
        hide={application.flightSearch.selected && application.flightSearch.selected !== flight.id}
      />));

    return (
      <div className="step -left">
        {isSearchingFlights && <Spinner info={t('Searching flights') + '...'} />}
        {hasFlightsToShow &&
        (<div>
          {process.env.DEMO && <TestModeNotification />}

          <h1>{t('Select your flight')}</h1>
          <Steps
            steps={application.steps}
            current={application.currentWizardView}
            set={setCurrentWizardView}
          />

          <div className={styles.flights}>{flights}</div>
        </div>)}

        {!hasFlightsToShow && !isSearchingFlights && <div>{t('no_available_flights')}</div>}

        {flightRatingRequested &&
          <Spinner info={`${t('Getting flight data for')} ${this.state.selected.carrier}${this.state.selected.flightNumber}...`} />}
      </div>
    );
  }
}

export default translate('searchFlights')(connect(null, {
  selectFlight,
})(SearchFlights));
