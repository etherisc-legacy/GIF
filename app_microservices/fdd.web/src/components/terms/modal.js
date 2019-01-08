import React from 'react';
import PropTypes from 'prop-types';
import { ModalContainer, ModalDialog } from 'shared/components/modal';
import Terms from './index';

const TermsModal = ({handleClose}) => (
  <ModalContainer onClose={handleClose}>
    <ModalDialog onClose={handleClose}>
      <Terms />
    </ModalDialog>
  </ModalContainer>
);

TermsModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
};

export default TermsModal;
