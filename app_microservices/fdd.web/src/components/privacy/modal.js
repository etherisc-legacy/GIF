import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ModalContainer, ModalDialog } from 'shared/components/modal';
import Privacy from './index';

export default class PrivacyModal extends Component {
  static propTypes = {
    handleClose: PropTypes.func.isRequired,
  }

  render() {
    return (
      <ModalContainer onClose={this.props.handleClose}>
        <ModalDialog onClose={this.props.handleClose}>
          <Privacy />
        </ModalDialog>
      </ModalContainer>
    );
  }
}
