import React from 'react';
import Article from 'shared/components/article';


const Contact = () => {
  if (process.env.DEMO) {
    return (
      <Article id="fdi_contact" title="Contact">
        <div className="contact-details col-sm-12 col-md-12">
          <p><strong>Etherisc GmbH</strong></p>
          <p>Zeller Weg 35a</p>
          <p>DE-82057 ICKING</p>
          <p><a href="https://etherisc.com">https://etherisc.com</a></p>
          <p>Email: <a href="mailto:contact@etherisc.com">contact@etherisc.com</a></p>
        </div>

        <div className="contact-details col-sm-12 col-md-12">
          <p>
            <a href="https://github.com/etherisc/flightDelay" target="_blank" rel="noopener noreferrer">
              <strong>Source code on Github</strong>
            </a>
          </p>
        </div>

      </Article>
    );
  } else {
    return (
      <Article id="fdi_contact" title="Contact">
        <div className="contact-details col-sm-12 col-md-12">
          <p><strong>Atlas Insurance PCC Limited</strong></p>
          <p>48-50, Ta&apos; Xbiex Seafront Ta&apos; Xbiex</p>
          <p>Tel: +356 2343 5363</p>
          <p>Email: <a href="mailto:fdd@atlas.com.mt?cc=policies@etherisc.com">fdd@atlas.com.mt</a></p>
        </div>

        <div className="col-sm-12 col-md-12" style={{ fontSize: 12 }}>
          <p>Image credits:</p>
          <p>
            Melbourne Airport by Christopher Neugebauer (adapted, CC-BY-SA 2.0)
          </p>
        </div>

        <div className="contact-details col-sm-12 col-md-12">
          <p>
            <a href="https://github.com/etherisc/flightDelay" target="_blank" rel="noopener noreferrer">
              <strong>Source code on Github</strong>
            </a>
          </p>
        </div>

      </Article>
    );
  }
};

export default Contact;
