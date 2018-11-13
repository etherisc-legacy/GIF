export const POLICY_STATE = {
  0: {
    label: 'Applied',
    actions: [
      {
        id: 0, method: 'decline', label: 'Decline', intent: 'danger', withDetails: true,
      },
      {
        id: 1, method: 'underwrite', label: 'Underwrite', intent: 'success',
      },
    ],
  },
  1: {
    label: 'Accepted',
    actions: [
      {
        id: 3, method: 'expire', label: 'Expire', intent: 'warning',
      },
    ],
  },
  2: {
    label: 'ForPayout',
    actions: [
      {
        id: 4, method: 'confirmPayout', label: 'Confirm payout', intent: 'success', withDetails: true,
      },
    ],
  },
  3: {
    label: 'PaidOut',
    actions: [],
  },
  4: {
    label: 'Expired',
    actions: [],
  },
  5: {
    label: 'Declined', actions: [],
  },
};

export const CLAIM_STATE = {
  0: {
    label: 'Applied',
    actions: [
      {
        id: 5, method: 'rejectClaim', label: 'Reject', intent: 'danger', withDetails: true,
      },
      {
        id: 6, method: 'confirmClaim', label: 'Confirm', intent: 'warning', withDetails: true,
      },
    ],
  },
  1: {
    label: 'Rejected',
    actions: [],
  },
  2: {
    label: 'Confirmed',
    actions: [],
  },
};
