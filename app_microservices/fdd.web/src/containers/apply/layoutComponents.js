import React from 'react';
import { Field } from 'redux-form';
import moment from 'moment';
import * as fdiFields from 'shared/components/fields';
import * as validations from 'shared/components/fields/validations';
import { arrivingAirports, departingAirports, airportsFrom, airportsTo } from 'shared/data/airports';
import { MIN_DEPARTURE_LIM, MAX_DEPARTURE_LIM } from 'shared/constants';
import styles from './styles.m.css';
import TestModeNotification from 'components/testModeNotifications/testnet';
import MainnetUnavailableNotification from "../../components/testModeNotifications/mainnet";

validations.maxLength100 = validations.maxLength(100);


const layoutComponents = {
  PoweredByEtherisc: ({ t }) => <div className={styles.powered}>{t('powered_by_etherisc')}</div>,

  TestModeNotification: () => <TestModeNotification />,

  MainnetUnavailableNotification: () => <MainnetUnavailableNotification />,

  InsuranceInfo: ({ t }) =>
    <div className={styles.intro}>
      <p>{t('atlas_insurance_info')}</p>
    </div>,

  Documents: ({ t, showPrivacy, showTerms, showInfo }) =>
    <div className="privacy">
      <button type="button" role="link" onClick={() => showPrivacy()}>{t('Privacy policy')}</button>

      <button type="button" role="link" onClick={() => showTerms()}>
        {t('Terms of Insurance Policy')}
      </button>

      <button type="button" role="link" onClick={() => showInfo()}>
        {t('Information for Existing and Prospective Policyholders')}
      </button>
    </div>,

  ApplyForm: (properties) => {
    const { t, options } = properties;

    const fields = options.fields
      .map((field, id) => ({...field, id}))
      .map(field => {
        const props = {};

        if (field.props) {
          Object.keys(field.props).forEach(prop => {
            if (prop.startsWith('moment::')) {
              props[prop.replace('moment::', '')] = moment()[field.props[prop][0]](...field.props[prop].slice(1));
            } else {
              props[prop] = field.props[prop];
            }
          });
        }

        if (field.showIfDefined) {
          for (let formField of field.showIfDefined) {
            if (!properties[formField]) {
              return <div className={field.wrapper} key={field.id} />
            }
          }
        }

        return (
          <div className={field.wrapper} key={field.id}>
            {!field.type && <Field
              name={field.name}
              className={field.className}
              component={fdiFields[field.component]}
              label={t(field.label)}
              validate={field.validate.map(rule => validations[rule])}
              {...props}
            />}

            {field.type === 'layoutComponent' &&
            React.createElement(layoutComponents[field.component], {...field.props, t })}
          </div>);
      });

    return <div>{fields}</div>;
  },

  SubmitButton: ({ t, id, className }) =>
    <div className="form-group -right">
      <button id={id} type="submit" className={className} tabIndex="-4">
        {t('Apply')}
      </button>
    </div>,
};

export default layoutComponents;
