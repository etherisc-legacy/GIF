const { airportsFrom, airportsTo } = require('./defaultAirports');

module.exports = [
  process.env.DEMO && { component: 'TestModeNotification', wrapper: 'col-md-12' },

  process.env.SUGGEST_DEMO && { component: 'MainnetUnavailableNotification', wrapper: 'col-md-12' },

  {
    component: 'ApplyForm',
    wrapper: '',
    options: {
      fields: [
        {
          wrapper: 'col-md-6',
          name: 'firstName',
          className: 'form-control text-field',
          component: 'FdiInput',
          label: 'First name',
          validate: ['required', 'maxLength100'],
        },
        {
          wrapper: 'col-md-6',
          name: 'lastName',
          className: 'form-control text-field',
          component: 'FdiInput',
          label: 'Last name',
          validate: ['required', 'maxLength100'],
        },
        {
          wrapper: 'col-md-6',
          name: 'email',
          className: 'form-control text-field',
          component: 'FdiInput',
          label: 'E-mail',
          validate: ['required', 'email'],
        },
        {
          wrapper: 'col-md-6 dateField',
          name: 'date',
          className: 'form-control text-field',
          component: 'FdiDatePicker',
          label: 'Date of departure',
          validate: ['required'],
          props: {
            'moment::minDate': ['add', 24, 'hours'],
            'moment::maxDate': ['add', 1, 'month'],
          },
        },
        {
          wrapper: 'col-md-6 selectField',
          name: 'from',
          className: '',
          component: 'FdiSelect',
          label: 'From',
          validate: ['required'],
          props: {
            placeholder: '',
            noResultsText: '',
            options: airportsFrom,
          },
        },
        {
          wrapper: 'col-md-6 selectField',
          name: 'to',
          className: '',
          component: 'FdiSelect',
          label: 'To',
          validate: ['required'],
          props: {
            placeholder: '',
            noResultsText: '',
            options: airportsTo,
          },
        },
        {
          wrapper: 'col-md-12',
          name: 'ticket',
          className: '',
          component: 'Checkbox',
          label: 'Please confirm that you have a ticket for this flight',
          validate: ['ticketRequired'],
          showIfDefined: ['from', 'to', 'date'],
        },
        {
          wrapper: 'col-md-12',
          type: 'layoutComponent',
          component: 'SubmitButton',
          props: {
            id: 'fdi_apply_btn_search',
            className: 'btn btn-sm btn-outline-inverse',
            label: 'Apply',
          },
        },
      ],
    },
  },

  { component: 'InsuranceInfo', wrapper: 'col-md-12' },

  { component: 'Documents', wrapper: 'col-md-12' },
];
