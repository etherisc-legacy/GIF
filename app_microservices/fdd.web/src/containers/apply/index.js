import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import * as validations from 'shared/components/fields/validations';
import PrivacyModal from 'components/privacy/modal';
import TermsModal from 'components/terms/modal';
import InfoForPolicyholders from 'components/infoForPolicyholders/modal';
import * as apiActions from 'modules/api/actions';
import * as appActions from 'modules/application/actions';
import { arrivingAirports, departingAirports, airportsFrom, airportsTo } from 'shared/data/airports';
import Article from 'shared/components/article';
import { MIN_DEPARTURE_LIM, MAX_DEPARTURE_LIM } from 'shared/constants';
import WizardModal from './wizardModal';
import styles from './styles.m.css';
import MainnetUnavailableNotification from '../../components/testModeNotifications/mainnet';
import { translate } from 'react-i18next';
import layoutComponents from './layoutComponents';
import CustomConfig from './../../shared/customConfig';
import defaultLayout from './defaultLayout';

validations.maxLength100 = validations.maxLength(100);


class Apply extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    closePrivacy: PropTypes.func.isRequired,
    closeTerms: PropTypes.func.isRequired,
    closeWizard: PropTypes.func.isRequired,
    closeInfo: PropTypes.func.isRequired,
    submitApplicationForm: PropTypes.func.isRequired,
  };

  submit = values => this.props.submitApplicationForm(values)

  closeWizardHandler = (e) => {
    if (e.target.className.toString().indexOf('notification') !== -1) {
      return;
    }

    if (
      this.props.application && this.props.application.policy &&
      (
        this.props.application.policy.isApplyPolicyEthReq ||
        this.props.application.policy.isCreatePolicyEthReq ||
        this.props.application.policy.isApplyRequest ||
        this.props.application.policy.isCreatePolicyRequest
      )
    ) {
      return;
    }

    this.props.closeWizard();
  }

  render() {
    const {
      handleSubmit,
      closePrivacy,
      closeTerms,
      closeInfo,
      application,
    } = this.props;

    if (process.env.SUGGEST_DEMO) {
      return (<Article id="fdi_apply" title="">
        <MainnetUnavailableNotification />
      </Article>);
    } else {
      const title = process.env.DEMO ? 'Apply for test Policy' : 'Apply for Policy';
      const { t } = this.props;

      const layout = CustomConfig.applyPolicy.layout || defaultLayout;

      const elements = layout.filter(element => element).map((element, i) => {
        return <div key={i} className={element.wrapper || ''}>
          {React.createElement(layoutComponents[element.component], { ...this.props, options: element.options })}
        </div>
      });

      return (
        <Article id="fdi_apply" title={title}>
          <form onSubmit={handleSubmit(this.submit)}>
            <div className={cn('col-sm-12', 'pull-right', styles.wrapper)}>
              <div className={cn('col-sm-4', 'col-md-3', styles.details)} />

              <div className="col-sm-8 col-md-9 form-style form-wrap-style">
                {elements}
              </div>
            </div>
          </form>

          {application.isShowingWizard &&
            <WizardModal
              compare={application.currentWizardView}
              handleClose={(e) => this.closeWizardHandler(e)}
            />
          }

          {application.isShowingPrivacy && <PrivacyModal handleClose={() => closePrivacy()} />}

          {application.isShowingTerms && <TermsModal handleClose={() => closeTerms()} />}

          {application.isShowingInfo && <InfoForPolicyholders handleClose={() => closeInfo()} />}
        </Article>
      );
    }
  }
}

const form = 'applyByReservationCode';
const selector = formValueSelector(form);

export default translate('applyForm')(connect(
  state => ({
    application: state.application,
    from: selector(state, 'from'),
    to: selector(state, 'to'),
    date: selector(state, 'date'),
  }),
  {
    reqReservation: apiActions.reqReservation,
    reqSearchFlight: apiActions.reqSearchFlights,
    setCustomer: appActions.setCustomer,
    closeSelectFlight: appActions.closeSelectFlight,
    closeWizard: appActions.closeWizard,
    showTerms: appActions.showTerms,
    closeTerms: appActions.closeTerms,
    showPrivacy: appActions.showPrivacy,
    closePrivacy: appActions.closePrivacy,
    showTxInfo: appActions.showTxInfo,
    closeTxInfo: appActions.closeTxInfo,
    showInfo: appActions.showInfo,
    closeInfo: appActions.closeInfo,
    selectFlight: appActions.selectFlight,
    submitApplicationForm: appActions.submitApplicationForm,
    reqScheduleFields: apiActions.reqScheduleFields,
  },
)(reduxForm({ form })(Apply)));
