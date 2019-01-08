import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import styles from './styles.m.css';

const Spinner = (props) => {
  const bars = [];

  for (let i = 0; i < 12; i += 1) {
    const animationDelay = `${(i - 12) / 10}s`;
    const transform = `rotate(${(i * 30)}deg) translate(146%)`;

    const barStyle = {
      WebkitAnimationDelay: animationDelay,
      animationDelay,
      WebkitTransform: transform,
      transform,
    };

    bars.push(<div style={barStyle} className={styles.bar} key={i} />);
  }

  const spinnerClassNames = cn(
    styles.spinner,
    styles[props.size],
    {
      [props.className]: props.className || false,
    },
  );

  return (
    <div className={styles.wrapper}>
      <div className={spinnerClassNames}>
        {bars}
      </div>
      {props.info && <div className={styles.info}>{props.info}</div>}
    </div>
  );
};

Spinner.propTypes = {
  className: PropTypes.string,
  info: PropTypes.string,
  size: PropTypes.string,
};

Spinner.defaultProps = {
  className: null,
  info: null,
  size: 'small',
};

export default Spinner;

