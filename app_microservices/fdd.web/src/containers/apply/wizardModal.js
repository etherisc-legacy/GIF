import React from 'react';
import PropTypes from 'prop-types';
import { ModalContainer, ModalDialog } from 'shared/components/modal';
import Wizard from './wizard';

const WizardModal = ({handleClose}) => (
  <ModalContainer onClose={handleClose}>
    <ModalDialog onClose={handleClose}>
      <Wizard />
    </ModalDialog>
  </ModalContainer>
);

WizardModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
};

export default WizardModal;

