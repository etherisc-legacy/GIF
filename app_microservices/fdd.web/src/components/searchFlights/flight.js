import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import Plane from 'react-icons/lib/fa/plane';
import moment from 'moment';
import { translate } from 'react-i18next';
import styles from './styles.m.css';

class Flight extends Component {
  static propTypes = {
    flight: PropTypes.shape.isRequired,
    index: PropTypes.number.isRequired,
    selectFlight: PropTypes.func.isRequired,
    hide: PropTypes.bool.isRequired,
    t: PropTypes.func.isRequired
  }

  select = (codeshare) => {
    const selection = codeshare.split('/');
    const [ carrier, flightNumber ] = selection;
    const flight = {...this.props.flight};

    flight.carrier = carrier;
    flight.flightNumber = flightNumber;

    this.props.selectFlight(flight);
  }

  selectIfNoCodeshares = (flight, codeshares) => {
    if (!codeshares) {
      this.props.selectFlight(flight);
    }
  }

  render() {
    const {
      flight,
      index,
      selectFlight,
      hide,
      t
    } = this.props;

    let codeshares = flight.codeshares ? `${flight.codeshares}` : '';

    if (codeshares) {
      codeshares = codeshares.split(', ')
      codeshares.unshift(`${flight.carrier}/${flight.flightNumber}`);
      codeshares = codeshares.map(codeshare =>
        <div key={codeshare} className={styles.codeshare} onClick={() => this.select(codeshare)}>{codeshare.replace('/', '')}</div>
      );
    }

    return (
      <div
        className={cn([styles.flight], { [styles.hide]: hide, [styles.noCodeshares]: !codeshares })}
        onClick={() => this.selectIfNoCodeshares(flight, codeshares)}
      >
        <div className={styles.icon}><Plane /></div>
        <div>
          {flight.description && <div>{flight.description}</div>}
          <div>{moment(flight.departureTime).utcOffset(moment.parseZone(flight.departureTime).utcOffset()).format('HH:mm YYYY-MM-DD ')} {flight.origin}-{flight.destination} {codeshares ? '' : `${flight.carrier}${flight.flightNumber}`}</div>
          <div>
            {t('Arrives at')}:
            {moment(flight.arrivalTime).utcOffset(moment.parseZone(flight.arrivalTime).utcOffset()).format('HH:mm YYYY-MM-DD')}
          </div>
          <div>{codeshares ?
            <div className={styles.codesharesWrapper}>
              <div className={styles.codesharesPre}>{t('Select flight')}:</div>
              <div className={styles.codeshares}>{codeshares}</div>
            </div> : ''}
          </div>
        </div>
      </div>
    );
  }
}

export default translate('flight')(Flight);
