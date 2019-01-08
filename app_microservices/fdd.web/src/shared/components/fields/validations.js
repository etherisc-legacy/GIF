import i18next from 'i18next';

/*
 * Validations for fields
 */

const t = (key, opts = {}) => i18next.t(key, { ns: 'validations', ...opts });

export const required = value => (value ? undefined : t('Required'));

export const ticketRequired = value => (value ? undefined : t('Confirm that you have the ticket'));

export const maxLength = max => value =>
  value && value.length > max ? t('length_must_be_less', { max }) : undefined;

export const minLength = min => value =>
  value && value.length < min ? t('length_must_be_more', { min }) : undefined;

export const number = value =>
  value && isNaN(Number(value)) ? t('Must be a number') : undefined;

export const minValue = min => value =>
  value && value < min ? t('must_be_great_or_equal', { min }) : undefined;

export const maxValue = max => value =>
  value && value > max ? t('must_be_less_or_equal', { max }) : undefined;

export const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? t('Invalid email address') : undefined;

export const alphaNumeric = value =>
  value && /[^a-zA-Z0-9 ]/i.test(value)
    ? t('Only alphanumeric characters') : undefined;
