import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import PrintIcon from 'react-icons/lib/fa/print';
import { translate } from 'react-i18next';
import styles from './styles.m.css';

const Row = ({label, value, wrapValue}) => (
  <tr className={styles.row}>
    <td className={styles.label}>{label}</td>
    <td className={cn(styles.value, {[styles.wrap]: wrapValue})}>{value}</td>
  </tr>
);

Row.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  wrapValue: PropTypes.bool,
};

Row.defaultProps = {
  label: '',
  value: '',
  wrapValue: false,
};

const CertificateBlank = ({certificate, t}) => (
  <div className={styles.certificate}>
    <div className={styles.buttons}>
      <div className={styles.button}>
        <PrintIcon />
        <button className={styles.printBtn} onClick={() => window.print()}>{t('Print')}</button>
      </div>
    </div>
    <table className={styles.details}>
      <tbody>
        <Row
          label={t('Policyholder') + ':'}
          value={`${certificate.policyHolder.firstname} ${certificate.policyHolder.lastname} (email: ${certificate.policyHolder.email})`}
        />


        <tr className={styles.row}>
          <td className={styles.label}>{t(`${process.env.DEMO ? 'Test ' : ''}Policy #`) + ':'}</td>
          <td className={cn(styles.value, {[styles.wrap]: true})}>
            <a
              href={`/certificate/${certificate.number}`}
              target="_blank"
              className={styles.link}
            >
              {certificate.number}
            </a>
          </td>
        </tr>

        <Row
          label={t('Flight') + ':'}
          value={`${t('Carrier')}: ${certificate.flight.carrier}, ${t('flight number')}: ${certificate.flight.flightNumber}`}
        />

        <Row
          label={t('From/When') + ':'}
          value={`${certificate.flight.origin} ${certificate.flight.departsAt}`}
        />

        <Row
          label={t('To/When') + ':'}
          value={`${certificate.flight.destination} ${certificate.flight.arrivesAt}`}
        />

        <Row
          label={t(`${process.env.DEMO ? 'Test ' : ''}Policy Start Date`) + ':'}
          value={certificate.policyStartDate}
        />

        <Row
          label={t(`${process.env.DEMO ? 'Test ' : ''}Policy Expiry Date`) + ':'}
          value={certificate.policyExpireDate}
        />

        <tr className={styles.row}>
          <td className={styles.label}>{t('Premium Amount') + ':'}</td>
          <td className={cn(styles.value, {[styles.wrap]: true})}>
            <p>
              {t('Total')}, <span className={styles.currency}>{certificate.premium.currency}</span>:
              {' '}{certificate.premium.amount}
            </p>
            {!process.env.DEMO && (<div>
              <p>{t('premium_hint_line1')}</p>
              <p>{t('premium_hint_line2')}</p>
              <p>{t('premium_hint_line3')}</p>
            </div>)}
          </td>
        </tr>


        <tr className={styles.row}>
          <td className={styles.label}>{t('Compensation')}</td>
          <td className={styles.value}>
            <p>
              <b>
                {t('Payouts for premium')} {certificate.premium.amount},
                {' '}<span className={styles.currency}>{certificate.premium.currency}</span>
              </b>
            </p>
            <table className={styles.payouts}>
              <tbody>
                <tr>
                  <td className={styles.wrap}>{t('Delay in minutes')}</td>
                  {/* <td>15-29</td>
                  <td>30-44</td> */}
                  <td>45+</td>
                  <td className={styles.wrap}>{t('Cancelled')}</td>
                  <td className={styles.wrap}>{t('Diverted')}</td>
                </tr>
                <tr>
                  <td>{t('Payout')}</td>
                  {/* <td>{certificate.compensation.d15}</td>
                  <td>{certificate.compensation.d30}</td> */}
                  <td>{certificate.compensation.d45}</td>
                  <td>{certificate.compensation.can}</td>
                  <td>{certificate.compensation.div}</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>

    {!process.env.DEMO && (<div className={styles.appendix}>
      {t('insurance_terms')}
    </div>)}
  </div>
);

CertificateBlank.propTypes = {
  certificate: PropTypes.shape.isRequired,
  t: PropTypes.func.isRequired
};

export default translate('certificate')(CertificateBlank);
