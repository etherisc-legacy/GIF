import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { FdiInput } from 'shared/components/fields';
import { required } from 'shared/components/fields/validations';
import Article from 'shared/components/article';
import { reqCustomerPolicies } from 'modules/api/actions';
import moment from 'moment';


function getStatus(status) {
  if (status === '0') return 'Applied';
  if (status === '1') return 'Accepted';
  if (status === '2') return 'Revoked';
  if (status === '3') return 'PaidOut';
  if (status === '4') return 'Expired';
  if (status === '5') return 'Declined';
  if (status === '6') return 'SendFailed';

  return status;
}

class WatchPolicy extends Component {
  static propTypes = {
    reqCustomerPolicies: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
  }

  submit = (values) => this.props.reqCustomerPolicies({ customerId: values.customerId })

  render() {
    const { handleSubmit, application } = this.props;

    const showPolicies = application.customer && application.customer.policies &&
      application.customer.policies.length > 0;

    const policies = showPolicies && application.customer.policies
      .map((policy, i) => (
        <tr key={policy.id}>
          <td>{ i + 1 }</td>
          <td>{policy.carrier}{policy.flightNumber}</td>
          <td>{moment(policy.departsAt).utcOffset(moment.parseZone(policy.departsAt).utcOffset()).format('MMMM DD, YYYY HH:mm')}</td>
          <td>{policy.amount} {policy.currency}</td>
          <td>{getStatus(policy.status)}</td>
        </tr>
      ));

    const title = process.env.DEMO ? 'Watch your test policy' : 'Watch your policy';
    const label = process.env.DEMO ? 'Get test policies' : 'Get policies';

    return (
      <Article id="watchPolicy" title={title}>
        {!showPolicies && (
          <form onSubmit={handleSubmit(this.submit)}>
            <div className="col-md-12 watchPolicy__text">
              Insert your CustomerId here
            </div>

            <div className="col-md-8 watchPolicy__input">
              <Field name="customerId" className="form-control text-field" placeholder="Customer id" component={FdiInput} validate={[required]} />
            </div>

            <div className="col-md-4">
              <div className="form-group -right watchPolicy__btn">
                <button id="fdi_apply_btn_search" type="submit" className="btn btn-sm btn-outline-inverse" tabIndex="-4">{label}</button>
              </div>
            </div>
          </form>
        )}

        {showPolicies && (
          <div>
            <section className="grid row clearfix">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Flight</th>
                    <th>Departure</th>
                    <th>Premium</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {policies}
                </tbody>
              </table>
            </section>

            <div className="col-md-12">
              <div className="another-flight">
                <a href="#fdi_apply" className="btn btn-sm btn-outline-inverse">Insure another flight</a>
              </div>
            </div>
          </div>
        )}
      </Article>
    );
  }
}

const form = 'watchPolicy';

export default connect(
  ({application}) => ({application}),
  {
    reqCustomerPolicies,
  },
)(reduxForm({ form })(WatchPolicy));
