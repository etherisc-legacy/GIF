import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const Steps = ({ steps, current, set, lock = false }) => {
  const links = steps
    .map((step, i) => {
      const clickHandler = () => {
        if (!lock && step.available) {
          set({view: step.view});
        }
        return false;
      };

      return (
        <div key={i + 1} onClick={() => clickHandler()}>
          <span
            className={cn({
              '-current': current === step.view,
              '-available': !lock && step.available,
            })}
          >
            { i + 1}
          </span>
        </div>);
    });

  return (
    <div className="steps-nav">
      {links}
    </div>
  );
};

Steps.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.shape).isRequired,
  current: PropTypes.string.isRequired,
  set: PropTypes.func.isRequired,
};

export default Steps;
