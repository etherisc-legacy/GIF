import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Pane, Dialog, Button, TextInput, toaster,
} from 'evergreen-ui';

/**
 * Transaction confirmation dialog
 */
class ConfirmationDialog extends Component {
  state = {
    isShown: false,
    isLoading: false,
    details: '',
  };

  static propTypes = {
    id: PropTypes.string.isRequired,
    action: PropTypes.string.isRequired,
    request: PropTypes.func.isRequired,
    updateAfterTransaction: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    withDetails: PropTypes.bool.isRequired,
    intent: PropTypes.string.isRequired,
  };

  confirm = () => {
    const {
      action, id, request, updateAfterTransaction,
    } = this.props;
    const { details } = this.state;

    this.setState({ isLoading: true });

    request(action, { id, details })
      .then(({ data }) => {
        if (data.error) {
          this.setState({ isShown: false });
          toaster.danger(`An error has occurred: ${data.error}`);
        } else {
          this.setState({ isShown: false });
          updateAfterTransaction(data);
        }
      })
      .catch((err) => {
        console.error(err);
        this.setState({ isShown: false });
      });
  };

  /**
   * Render component
   * @return {*}
   */
  render() {
    const { isShown, isLoading, details } = this.state;
    const { label, withDetails, intent } = this.props;

    return (
      <Pane>
        <Dialog
          isShown={isShown}
          title="Transaction confirmation"
          onCloseComplete={() => this.setState({ isShown: false, isLoading: false })}
          isConfirmLoading={isLoading}
          onConfirm={this.confirm}
          confirmLabel={isLoading ? 'Loading...' : label}
        >
          {!withDetails && (
            <p>Are you sure you want to confirm this transaction?</p>
          )}

          {withDetails && (
            <div>
              <p>Are you sure you want to confirm this transaction? If so, please specify the details:</p>
              <TextInput
                placeholder="Details"
                width="100%"
                fontSize="14px"
                onChange={e => this.setState({ details: e.target.value })}
                value={details}
              />
            </div>
          )}
        </Dialog>

        <Button
          onClick={() => this.setState({ isShown: true })}
          marginRight={16}
          appearance="primary"
          height={32}
          intent={intent}
        >
          {label}
        </Button>
      </Pane>
    );
  }
}

export default ConfirmationDialog;
