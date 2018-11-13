import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Spinner } from 'evergreen-ui';
import ConfirmationDialog from 'components/ConfirmationDialog';
import moment from 'moment';
import numeral from 'numeral';
import { POLICY_STATE, CLAIM_STATE } from './config';


/**
 * Decode hex to string
 * @param {string} value
 * @return {string}
 */
function hexToUtf8(value) {
  const hex = value.toString();

  let str = '';
  for (let i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }

  return str;
}

const Article = styled.div`
  height: 100%;
  display: flex;
  padding: 60px 0 0 0;
  position: relative;
`;


const Column = styled.div`
  width: 50%;
  background: #ffebcd;
  border-left: 1px solid #dcc19e;
  height: 100%;
  overflow-y: scroll;
  position: relative;
`;

const Title = styled.div`
  background: #f2d4af;
  font-weight: bold;
  padding: 20px;
  position: fixed;
  width: 100%;
  z-index: 1;
`;

const List = styled.div`
  margin-top: 80px;
`;

const Item = styled.div`
  background: #fff;
  padding: 15px;
  margin: 20px;
  box-shadow: 0 2px 6px 0 rgba(0,0,0,0.12);
  border-radius: 3px;
`;

const Actions = styled.div`
  margin-top: 20px;
  display: flex;
`;

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
`;

/**
 * Dashboard page
 */
class Dashboard extends Component {
  state = {
    policies: [],
    claims: [],
    loadingPolicies: true,
    loadingClaims: true,
  };

  static propTypes = {
    request: PropTypes.func.isRequired,
  };

  /**
   * On component mounted livecycle hook
   */
  componentDidMount() {
    this.loadPolicies();
    this.loadClaims();
  }

  /**
   * Update policies and claims lists after transaction
   * @param {{}} data
   */
  updateAfterTransaction = (data) => {
    const { claims, policies } = this.state;

    if (data.policy) {
      const index = policies.findIndex(policy => Number(policy.policyId) === Number(data.policy.policyId));

      const list = [
        ...policies.slice(0, index),
        data.policy,
        ...policies.slice(index + 1),
      ];

      this.setState({ policies: [...list] });
    }

    if (data.claim) {
      const index = claims.findIndex(claim => Number(claim.claimId) === Number(data.claim.claimId));

      const list = [
        ...claims.slice(0, index),
        data.claim,
        ...claims.slice(index + 1),
      ];

      this.setState({ claims: [...list] });
    }
  };

  /**
   * Load the list of all policies
   */
  loadPolicies = () => {
    const { request } = this.props;

    if (window.socket && window.socket.isOpened) {
      request('getPolicies')
        .then(data => this.setState({ policies: data.policies, loadingPolicies: false }))
        .catch(console.error);
    } else {
      setTimeout(() => this.loadPolicies(), 100);
    }
  }

  /**
   * Load the list of all claims
   */
  loadClaims = () => {
    const { request } = this.props;
    if (window.socket && window.socket.isOpened) {
      request('getClaims')
        .then(data => this.setState({ claims: data.claims, loadingClaims: false }))
        .catch(console.error);
    } else {
      setTimeout(() => this.loadClaims(), 100);
    }
  }

  /**
   * Render component
   * @return {*}
   */
  render() {
    const {
      policies, claims, loadingPolicies, loadingClaims,
    } = this.state;
    const { request } = this.props;

    const policiesList = policies.map(policy => (
      <Item key={policy.policyId}>
        <div><b>{hexToUtf8(policy.product)}</b></div>
        <div>Policy ID: {policy.policyId}</div>
        <div>State: {POLICY_STATE[policy.state].label}</div>
        <div>State message: {hexToUtf8(policy.stateMessage)}</div>
        <div>Last update: {moment.unix(policy.stateTime).utc().format('YYYY-MM-DD HH:mm:ss')} UTC</div>
        <div>Premium: {numeral(policy.premium / 100).format('0,0.00')}</div>

        {POLICY_STATE[policy.state].actions.length > 0 && (
          <Actions>
            {POLICY_STATE[policy.state].actions.map(action => (
              <ConfirmationDialog
                key={action.id}
                action={action.method}
                label={action.label}
                intent={action.intent || 'success'}
                request={request}
                withDetails={action.withDetails || false}
                id={policy.policyId}
                updateAfterTransaction={this.updateAfterTransaction}
              />
            ))}
          </Actions>
        )}
      </Item>
    ));

    const claimsList = claims.map(claim => (
      <Item key={claim.claimId}>
        <div>
          <b>Claim ID: {claim.claimId}</b>
        </div>
        <div>Policy ID: {claim.policyId}</div>
        <div>State: {CLAIM_STATE[claim.state].label}</div>
        <div>State message: {hexToUtf8(claim.stateMessage)}</div>
        <div>Last update: {moment.unix(claim.stateTime).utc().format('YYYY-MM-DD HH:mm:ss')} UTC</div>

        {CLAIM_STATE[claim.state].actions.length > 0 && (
          <Actions>
            {CLAIM_STATE[claim.state].actions.map(action => (
              <ConfirmationDialog
                key={action.id}
                action={action.method}
                label={action.label}
                intent={action.intent || 'success'}
                request={request}
                withDetails={action.withDetails || false}
                id={claim.claimId}
                updateAfterTransaction={this.updateAfterTransaction}
              />
            ))}
          </Actions>
        )}
      </Item>
    ));

    return (
      <Article>
        <Helmet>
          <title>Dashboard</title>
        </Helmet>

        <Column>
          <Title>Policies</Title>

          <List>
            {loadingPolicies && <SpinnerWrapper><Spinner /></SpinnerWrapper>}
            {!loadingPolicies && policiesList}
          </List>
        </Column>

        <Column>
          <Title>Claims</Title>
          <List>
            {loadingClaims && <SpinnerWrapper><Spinner /></SpinnerWrapper>}
            {!loadingPolicies && claimsList}
          </List>
        </Column>
      </Article>
    );
  }
}

export default Dashboard;
