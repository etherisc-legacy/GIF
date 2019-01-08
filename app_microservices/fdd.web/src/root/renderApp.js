/* eslint-disable no-unused-expressions */
import React, { createElement } from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

// #if process.env.USE_CUSTOMIZATION_CONFIG === 'true'
import styles from '../config/fdd.web/base/styles.m.css';
// #endif


export default (component, props) =>
  render(
    <AppContainer>
      {createElement(component, props)}
    </AppContainer>,
    document.getElementById('root'),
  );
