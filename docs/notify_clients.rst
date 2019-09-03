
Notify Clients
**************

To provide notifications to its customers Product's contract can use Notification microservice, which provides notifications based on triggering events.

This microservice informs Product's contract and its customers about the processing and the state of his application for policy, policy itself, payment details, his claim for policy and payout details via e-mail as well as notifies Product builders via Telegram chat specifically.

There are two main transports available for Product contractss on Etherisc platform:

- SMTP transport
- Telegram transport

Notification microservice receives an event message about the need for delivery from other microservices and sends it for delivery to the appropriate transports. 

Every message for Notification MS contains what, where and with what credentials to send.

The event message should include the following data: 

1. name of the template; 
2. data to fill in the template;  
3. properties (i.e. recipient e-mail)

Product may create branded templates to use instead of default templates. Notification microservice simply takes a template, substitutes the data and sends it where it is requested. A Product's contract can have templates in any languages, saving them to platform templates.

Product application provides notificationSettingsUpdate event with branded templates and description what notification are to be used.

See code details:

::

    transports: [
            {
              name: 'smtp',
              props: {
                from: 'noreply@etherisc.com',
            },
              events: ['application_declined', 'application_error'],
            },
            {
              name: 'telegram',
              props: {
                chatId:'54321',
            },
              events: ['application_declined', 'application_error'],
            },
          ],
       
    templates: [
            {
              name: 'application_error',
              transport: 'smtp',
              template: '<h1>Application Error {{policy.id}}</h1>',
            },
            {
              name: 'application_error',
              transport: 'telegram',
              template: 'Application Error {{policy.id}}',
            },
          ];
 
          type: 'application_error',
          data: { policy: { id: 1514 } },
          props: {
            recipient: 'foo@email.com',
            subject: 'Etherisc application error',
          }

  
See events triggers here:

+---------------------------+---------------------------------+--------------------------------+
| **Message Name**          | **Description**                 | **Triggered**                  |
|                           |                                 |                                |
+===========================+=================================+================================+
| **quote_successful**      | Your quote is created           | Application state is changed   |
|                           | successfully. We are contacting | to "Underwritten"              |
|                           | you regarding payment details.  |                                |
|                           | Please provide a necessary      |                                |
|                           | payment for premium             |                                | 
+---------------------------+---------------------------------+--------------------------------+
| **charge_cancelled**      | We're unable to process your    | Payment request to provider    |
|                           | payment card. Please try        | was not successful             |
|                           | another card                    |                                |
+---------------------------+---------------------------------+--------------------------------+
| **application _declined** | We are sorry to inform that     | Application state is changed   |
|                           | the application for Policy has  | to "Declined"                  |
|                           | been declined by underwriter    |                                |
+---------------------------+---------------------------------+--------------------------------+
| **application_error**     | Technical error: the requested  | Application has not been found |
|                           | application has not been found  |                                |
+---------------------------+---------------------------------+--------------------------------+
| **premium_paid**          | We've received your premium     | Customer has paid a premium    |
|                           | payment                         |                                |
+---------------------------+---------------------------------+--------------------------------+
| **application_revoked**   | We confirm that the application | Application state is changed   |
|                           | for Policy has been revoked.    | to "Revoked"                   |
|                           | Your premium minus cancellation |                                |
|                           | fee will be sent back to you    |                                |
+---------------------------+---------------------------------+--------------------------------+
| **policy_issued**         | We confirm that Policy has been | Token has been issued. Policy  |
|                           | issued. Details below...        | is created                     |
+---------------------------+---------------------------------+--------------------------------+
| **policy_error**          | Technical error: the requested  | Policy has not been found      |
|                           | policy has not been found       |                                |
+---------------------------+---------------------------------+--------------------------------+
| **policy_expired**        | We inform you that Policy       | Policy state is changed to     |
|                           | has been expired                | "Expired"                      |
+---------------------------+---------------------------------+--------------------------------+
| **claim_confirmed**       | Your claim regarding Policy has | Claim state is changed to      |
|                           | been confirmed. The payout will | "Confirmed"                    |
|                           | be transferred to your payment  |                                |
|                           | card                            |                                |
+---------------------------+---------------------------------+--------------------------------+
| **claim_declined**        | We inform you that your claim   | Claim state is changed to      |
|                           | regarding Policy has been       | "Declined"                     |
|                           | declined                        |                                |
+---------------------------+---------------------------------+--------------------------------+
| **claim_error**           | Technical error: the requested  | Claim has not been found       |
|                           | claim has not been found        |                                |
+---------------------------+---------------------------------+--------------------------------+
| **claim_paid_out**        | Your claim for Policy has been  | Payout state is changed to     |
|                           | paid out                        | "PaidOut"                      |
+---------------------------+---------------------------------+--------------------------------+


View Ledger of Funds on Different Accounts
******************************************

There are several accounts we distribute money to:

- Balance - wallet is used to transfer funds;
- Premium - amount of money client pays for the policy;
- Risk Fund - fund which covers risks in case of payout;
- Operations Fund - fund which covers all operational costs (pricing, underwriting, oracle costs);
- Oracle Costs - amount of money we pay for pricing, underwriting, events confirmation;
- Payout - amount of money client gets when policy risk actually happens;
- Reward - payment to Etherisc platform from premiums (might not need it).

