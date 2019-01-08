import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import * as apiActions from 'modules/api/actions';
import CertificateBlank from './certificateBlank';

class MyCertificate extends Component {
  static propTypes = {
    reqCertificate: PropTypes.func.isRequired,
    match: PropTypes.shape.isRequired,
    application: PropTypes.shape.isRequired,
  }

  componentDidMount() {
    this.props.reqCertificate({
      certificateId: this.props.match.params.certificateId,
    });
  }

  render() {
    const { t } = this.props;

    return (
      <section id="main-content" className="clearfix">

        <article className="section-wrapper clearfix">
          <div style={{position: 'relative', top: 40}} className="content-wrapper clearfix"
               ref={node => { this.content = node; }}>
            <div className="col-sm-12 pull-right">
              <h1 className="section-title">{t('Certificate Of Insurance')}</h1>
              <div className="col-md-10 col-md-offset-2 cert">
                {this.props.application.myCertificate &&
                  <CertificateBlank certificate={this.props.application.myCertificate} />}
              </div>
            </div>
          </div>
        </article>

      </section>
    );
  }
}

export default connect(
  ({application}) => ({application}),
  {
    reqCertificate: apiActions.reqCertificate,
  },
)(translate('certificate')(MyCertificate));
