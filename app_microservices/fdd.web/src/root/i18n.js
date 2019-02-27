import i18n from 'i18next';
import moment from 'moment';
import LanguageDetector from 'i18next-browser-languagedetector';
import { reactI18nextModule } from 'react-i18next';
import CustomConfig from './../shared/customConfig';


const enLocale = {
  searchFlights: {
    no_available_flights:
      'No available flights. You can get insurance for flights 24 hours before scheduled departure time.'
  },
  errorDialog: {
    insurance_not_available:
      'Seems like insurance for your flight is not available yet. Perhaps we can insure your next flight!?',
    insurance_for_departure_not_available: 'Insurance for this departure date is\'n available.',
    transaction_declined: 'Your transaction is declined for some reasons. Please, contact the administrator ' +
      'by email: policies@etherisc.com',
    no_enough_money: 'Seems like your bank declined the transaction or you don’t have enough money on your card',
    tx_timeout: '',
    tx_timeout_details: 'Your application has been received. The processing of your transaction ' +
      'can take some time. You can check the progress <a href="{{link}}" target="_blank">here</a>. After successful ' +
      'processing of your application and payment, you will receive an email with a confirmation and ' +
      'your insurance policy.',
    cluster_risk: 'There is a cluster risk, try to buy later.',
    invalid_payout_option: 'Invalid payout.'
  },
  warningDialog: {
    no_policies_found: 'No policies found',
  },
  certificate: {
    time_format: 'MMMM DD, YYYY HH:mm',
    time_format_destination: 'MMMM DD, YYYY HH:mm',
    locale: 'en',
    insurance_terms: 'This Insurance Certificate is issued according to the ' +
      'TERMS OF FLIGHT DELAY INSURANCE CONTRACT, by Atlas Insurance PCC Limited (C5601) ' +
      'a cell company authorised by the Malta Financial Services ' +
      'Authority to carry on general business. The noncellular ' +
      'assets of the company may be used to meet losses incurred by the cell ' +
      'in excess of their assets. Its registered address is 4850 ' +
      'Ta\' Xbiex Seafront, Ta\' Xbiex, Malta. For enquiries, email: fdd@atlas.com.mt.',
    premium_hint_line1: 'Stamp duty in Malta, EUR: 13.00',
    premium_hint_line2: 'Discount for stamp duty, EUR *: -13.00',
    premium_hint_line3: '* - Stamp Duty will be paid by Atlas Insurance PCC Limited on your behalf',
  },
  validations: {
    must_be_great_or_equal: 'Must be at least {{min}}',
    must_be_less_or_equal: 'Must be less than {{max}}',
  },
  applyForm: {
    atlas_insurance_info:
      'By using this website you are entering into an insurance contract ' +
      'directly with Atlas Insurance PCC Limited, an insurance company based ' +
      'in Malta. Please refer to the Terms of Insurance Policy for more details.',
    policy_terms_doc: 'https://docs.google.com/document/d/e/2PACX-1vR8cnBH7Il1umfHM7ltxHC6ITq-sQL7I5e6hdAoYbd' +
      'd6nKRmoJevU3V63h5KiArMg7ALqYvseLID8HA/pub?embedded=true',
    policy_holder_doc: 'https://docs.google.com/document/d/e/2PACX-1vSS-VTE-0F_xvzcQDADgiHTPr8xqHfyRTcMb8rzA2' +
      'pqNhxi5N-jweustegTssAC-2B1u8A9LNP0gREt/pub?embedded=true',
    privacy_policy_doc: 'https://docs.google.com/document/d/e/2PACX-1vTnVgGmy90D8YrHaRvnLuf2rZ__fWdfg4q5YPup_' +
      'Z7ZZ3hROCo9753myONPWKnccytzLVh7EamPoEwF/pub?embedded=true',
  },
};

export default function configureI18n() {
  moment.locale(CustomConfig.i18nOpts.lng || 'en');

  return i18n
    .use(LanguageDetector)
    .use(reactI18nextModule) // if not using I18nextProvider
    .init({
      fallbackLng: 'en',
      debug: true,
      defaultNS: 'translations',
      ns: 'translations',

      resources: {
        en: enLocale,
      },

      interpolation: {
        escapeValue: false, // not needed for react!!
      },

      react: {
        wait: false,
        bindI18n: 'languageChanged loaded',
        bindStore: 'added removed',
        nsMode: 'default',
      },

      ...CustomConfig.i18nOpts,
    });
}

