import React from 'react';
import Article from 'shared/components/article';

const About = () => (
  <Article id="about" title="About">
    <section className="feature-columns row clearfix">
      <h3>Key Facts</h3>
      <p>
        1. Information about the product on offer i.e. a  description  of  the
        main  characteristics of  the product  which  is  the  subject  of  the
        offer incl total price to be paid;
      </p>
      <p>
        2. Duration of the contract;
      </p>
      <p>
        3. Cancellation Rights (incl cooling off period);
      </p>
      <p>
        4. The Member State whose laws are taken by the underwriter as a basis for the establishment
        of relations with the consumer prior to the conclusion of the distance contact;
      </p>
      <p>
        5. Procedures for the submission of claims and a description of the claims handling
        procedure of the authorised insurance undertaking;
      </p>
      <p>
        6. Contact details of the officer of the authorised insurance undertaking responsible
        for consumer complaints and information that complaints may be referred by the
        complainant to the Office of the Arbiter for Financial Services established under the
        Arbiter for Financial Services Act, (Cap.555), if the complainant is not satisfied with
        the manner in which his complaint has been resolved by the authorised insurance undertaking;
      </p>
      <p>
        7. Statement as to whom the website is targeted, for example, residents in Malta and for all
        risks situated in Malta:
      </p>
      <p>
        You can state: Website is targeted to any policy holder whose risk relates to travel or
        holiday if the policy covering the risk is of a duration of four months or less and the
        policy is taken out in Malta.
      </p>

      <h3>Law and Jurisdiction</h3>
      <p>
        Maltese Law shall govern the use of www.xxxxxxx.com,
        and in the event of a dispute you irrevocably submit to the exclusive
        jurisdiction of the Maltese Courts.
      </p>
      <p>
        Unless otherwise specified, all contracts of insurance entered into with Atlas
        Insurance PCC Limited shall be Maltese contracts and shall be governed by and according
        to Maltese law and in the event of a dispute shall be subject to the exclusive jurisdiction
        of the Maltese Courts.
      </p>


      <h3>License to Operate</h3>
      <p>
        Under the terms of the Insurance Business Act 1998, the Malta Financial Services Authority
        has authorised Atlas Insurance PCC Limited (C5601), a cell company, to transact general
        insurance business in or from Malta; the non-cellular assets of the company may be used
        to meet losses incurred by the cells in excess of their assets.  Atlas Insurance PCC
        Limited has also been passported to write business in Austria, Belgium, Cyprus,
        Czech Republic, Estonia, France, Germany, Greece, Italy, Latvia, Lithuania, Luxembourg,
        Netherlands, Poland, Portugal, Spain, and United Kingdom. Please refer to the Financial
        Services Register on the Malta Financial Services Authority website for more information.
      </p>
    </section>
  </Article>
);

export default About;
