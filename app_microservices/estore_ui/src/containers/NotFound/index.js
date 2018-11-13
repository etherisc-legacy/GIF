import React from 'react';
import { Helmet } from 'react-helmet';

/**
 * NotFound page
 * @return {*}
 * @constructor
 */
const NotFound = () => (
  <article>
    <Helmet>
      <title>Not found</title>
    </Helmet>
    <h1>Page not found</h1>
  </article>
);

export default NotFound;
