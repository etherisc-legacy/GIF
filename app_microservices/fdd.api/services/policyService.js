const moment = require('moment');
const CertificateBuilder = require('./../model/policy/certificateBuilder');

/**
 * Policy service
 */
class PolicyService {
  /**
   * constructor
   * @param {*} param0
   */
  constructor({ payoutCalcService, policyRepo, customerRepo }) {
    this.customerRepo = customerRepo;
    this.policyRepo = policyRepo;
    this.payoutCalcService = payoutCalcService;
  }

  /**
   * Get many
   * @param {*} policyIds
   */
  async getAllPayouts(policyIds) {
    const { policyRepo } = this;

    const policies = await policyRepo
      .findAllWhereIdIn(policyIds);

    return policies
      .map(curPolicy => ({
        id: curPolicy.id,
        currency: curPolicy.currency.toUpperCase(),
        payouts: this.calculatePayouts(curPolicy),
      }));
  }

  /**
   * Get policy by id
   * @param {*} id
   */
  async getPolicy(id) {
    const { policyRepo, customerRepo } = this;
    const policy = await policyRepo.findById(id);

    if (!policy) { return null; }

    const customer = await customerRepo.findById(policy.customerId);

    const amount = this.formatAmount(policy);
    const payouts = this.calculatePayouts(policy);

    return new CertificateBuilder({
      policy,
      customer,
      amount,
      payouts,
    })
      .withLocalDateFormatter(this.formatLocalDate.bind(this))
      .withPolicyStartTimeFormatter(this.formatPolicyStart.bind(this))
      .withPolicyExpireTimeFormatter(this.formatPolicyExpireDate.bind(this))
      .build();
  }

  /**
   * Format local date
   * @param {*} date
   * @return {string}
   */
  formatLocalDate(date) {
    const offset = moment.parseZone(date).utcOffset();
    return `${moment(date).utcOffset(offset).format('MMMM DD, YYYY HH:mm')} (local time)`;
  }

  /**
   * Format policy start date
   * @param {*} date
   * @return {string}
   */
  formatPolicyStart(date) {
    return `${moment.unix(date).utc().format('MMMM DD, YYYY HH:mm')} GMT (Greenwich Mean Time)`;
  }

  /**
   * Format policy expire date
   * @param {*} date
   * @return {string}
   */
  formatPolicyExpireDate(date) {
    const offset = moment.parseZone(date).utcOffset();
    const dateStr = moment(date).utcOffset(offset).add(24, 'hours').format('MMMM DD, YYYY HH:mm');
    return `${dateStr} (local time at destination)`;
  }

  /**
   * find all by customer id
   * @param {*} customerId
   * @return {[]}
   */
  async findAllByCustomerId(customerId) {
    const policies = await this.policyRepo.findAllByCustomerId(customerId);
    return policies.map(policy => ({ ...policy, amount: this.formatAmount(policy) }));
  }

  /**
   * Calculate payouts
   * @param {{}} policy
   * @return {*}
   */
  calculatePayouts(policy) {
    const { payoutCalcService } = this;

    const amount = this.formatAmount(policy);
    const rating = JSON.parse(policy.rating);
    return payoutCalcService.calculatePayouts(rating)(amount, policy.currency);
  }

  /**
   * Format amount
   * @param {*} policy
   * @return {number}
   */
  formatAmount(policy) {
    const divider = policy.currency === 'eth' ? 10 ** 18 : 10 ** 2;
    return policy.amount / divider;
  }
}

module.exports = PolicyService;
