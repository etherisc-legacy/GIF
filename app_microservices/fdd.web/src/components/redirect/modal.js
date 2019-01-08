import React from 'react';
import PropTypes from 'prop-types';
import { ModalContainer, ModalDialog } from 'shared/components/modal';
import Redirect from './index';

const RedirectModal = ({ handleClose, link }) => (
  <ModalContainer onClose={handleClose}>
    <ModalDialog onClose={handleClose}>
      <Redirect link={link} />
    </ModalDialog>
  </ModalContainer>
);

RedirectModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
  link: PropTypes.string.isRequired,
};

export default RedirectModal;
