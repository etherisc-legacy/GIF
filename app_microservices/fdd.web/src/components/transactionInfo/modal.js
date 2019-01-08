import React from 'react';
import PropTypes from 'prop-types';
import { ModalContainer, ModalDialog } from 'shared/components/modal';
import TransactionInfo from './index';

const TransactionInfoModal = ({handleClose}) => (
  <ModalContainer onClose={handleClose}>
    <ModalDialog onClose={handleClose}>
      <TransactionInfo />
    </ModalDialog>
  </ModalContainer>
);

TransactionInfoModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
};

export default TransactionInfoModal;
