import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ModalContainer, ModalDialog } from 'shared/components/modal';

const Biography = ({name, photo, content}) => (
  <div className="step">
    <img src={photo} className="half-width" alt={name} />
    <h1>{name}</h1>
    {content}
  </div>
);

Biography.propTypes = {
  photo: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  content: PropTypes.shape.isRequired,
};

export default class PrivacyModal extends Component {
  static propTypes = {
    photo: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    children: PropTypes.shape.isRequired,
  }

  state = {
    showModal: false,
  }

  openModal = (e) => {
    e.preventDefault();
    this.setState({showModal: true});
  }

  closeModal = () => this.setState({showModal: false})

  render() {
    const {
      photo,
      name,
      children,
    } = this.props;
    return (
      <article className="feature-col col-md-4">
        <a href="/" onClick={this.openModal} className="thumbnail linked">
          <div className="image-container">
            <img src={photo} className="item-thumbnail" alt={name} />
          </div>
          <div className="caption">
            <h5>{name}</h5>
          </div>
        </a>
        {this.state.showModal && (
          <ModalContainer onClose={this.closeModal}>
            <ModalDialog onClose={this.closeModal}>
              <Biography name={name} photo={photo} content={children} />
            </ModalDialog>
          </ModalContainer>
        )}
      </article>
    );
  }
}
